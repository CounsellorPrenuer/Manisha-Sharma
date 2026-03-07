const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
}

export default {
    async fetch(request, env) {
        // Handle CORS preflight
        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: CORS_HEADERS });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        try {
            // --- Contact Form ---
            if (path === "/api/contact" && request.method === "POST") {
                const { name, email, phone, subject, message } = await request.json();
                if (!name || !email || !message) {
                    return jsonResponse({ error: "Missing required fields" }, 400);
                }
                await env.DB.prepare(
                    "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)"
                ).bind(name, email, phone || null, subject || "General", message).run();
                return jsonResponse({ success: true });
            }

            // --- Newsletter ---
            if (path === "/api/newsletter" && request.method === "POST") {
                const { email } = await request.json();
                if (!email) return jsonResponse({ error: "Email required" }, 400);
                await env.DB.prepare(
                    "INSERT OR IGNORE INTO newsletters (email) VALUES (?)"
                ).bind(email).run();
                return jsonResponse({ success: true });
            }

            // --- Get Razorpay Public Key ---
            if (path === "/api/config" && request.method === "GET") {
                return jsonResponse({ keyId: env.RAZORPAY_KEY_ID });
            }

            // --- Create Razorpay Order ---
            if (path === "/api/payment/create-order" && request.method === "POST") {
                const { amount, planName, customerName, customerEmail, customerPhone, couponCode, discountPercent } = await request.json();
                if (!amount || !planName) {
                    return jsonResponse({ error: "Amount and planName required" }, 400);
                }

                const amountInPaise = Math.round(amount * 100);
                const authHeader = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);

                const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${authHeader}`,
                    },
                    body: JSON.stringify({
                        amount: amountInPaise,
                        currency: "INR",
                        receipt: `receipt_${Date.now()}`,
                    }),
                });

                if (!orderRes.ok) {
                    const errText = await orderRes.text();
                    console.error("Razorpay order error:", errText);
                    return jsonResponse({ error: "Failed to create order" }, 500);
                }

                const order = await orderRes.json();

                // Save to DB
                await env.DB.prepare(
                    "INSERT INTO payments (order_id, amount, plan_name, status, customer_name, customer_email, customer_phone, coupon_code, discount_percent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
                ).bind(
                    order.id, amount, planName, "created",
                    customerName || null, customerEmail || null, customerPhone || null,
                    couponCode || null, discountPercent || 0
                ).run();

                return jsonResponse({
                    id: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    keyId: env.RAZORPAY_KEY_ID,
                });
            }

            // --- Verify Payment ---
            if (path === "/api/payment/verify" && request.method === "POST") {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
                if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                    return jsonResponse({ error: "Missing payment details" }, 400);
                }

                // Verify signature using Web Crypto API
                const encoder = new TextEncoder();
                const key = await crypto.subtle.importKey(
                    "raw",
                    encoder.encode(env.RAZORPAY_KEY_SECRET),
                    { name: "HMAC", hash: "SHA-256" },
                    false,
                    ["sign"]
                );
                const signatureData = encoder.encode(`${razorpay_order_id}|${razorpay_payment_id}`);
                const signatureBuffer = await crypto.subtle.sign("HMAC", key, signatureData);
                const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
                    .map((b) => b.toString(16).padStart(2, "0"))
                    .join("");

                if (expectedSignature === razorpay_signature) {
                    await env.DB.prepare(
                        "UPDATE payments SET status = 'paid', payment_id = ? WHERE order_id = ?"
                    ).bind(razorpay_payment_id, razorpay_order_id).run();
                    return jsonResponse({ success: true, message: "Payment verified" });
                } else {
                    await env.DB.prepare(
                        "UPDATE payments SET status = 'failed' WHERE order_id = ?"
                    ).bind(razorpay_order_id).run();
                    return jsonResponse({ error: "Invalid signature" }, 400);
                }
            }

            // --- Admin: Get all data ---
            if (path === "/api/admin/contacts" && request.method === "GET") {
                const { results } = await env.DB.prepare("SELECT * FROM contacts ORDER BY created_at DESC").all();
                return jsonResponse(results);
            }
            if (path === "/api/admin/newsletters" && request.method === "GET") {
                const { results } = await env.DB.prepare("SELECT * FROM newsletters ORDER BY subscribed_at DESC").all();
                return jsonResponse(results);
            }
            if (path === "/api/admin/payments" && request.method === "GET") {
                const { results } = await env.DB.prepare("SELECT * FROM payments ORDER BY created_at DESC").all();
                return jsonResponse(results);
            }

            return jsonResponse({ error: "Not found" }, 404);
        } catch (err) {
            console.error("Worker error:", err);
            return jsonResponse({ error: "Internal server error", details: err.message }, 500);
        }
    },
};

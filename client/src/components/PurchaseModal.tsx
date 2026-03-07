import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { X, Loader2, Tag, CheckCircle, AlertCircle } from "lucide-react";
import { sanityClient } from "@/lib/sanity";
import { API_BASE_URL } from "@/lib/api";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface PurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    planName: string;
    price: number;
    paymentButtonId: string;
}

export function PurchaseModal({ isOpen, onClose, planName, price, paymentButtonId }: PurchaseModalProps) {
    const [step, setStep] = useState<"form" | "coupon" | "pay">("form");
    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
    const [couponCode, setCouponCode] = useState("");
    const [couponStatus, setCouponStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");
    const [discount, setDiscount] = useState(0);
    const [couponDescription, setCouponDescription] = useState("");
    const { toast } = useToast();

    const finalPrice = Math.round(price - (price * discount) / 100);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone) {
            toast({ title: "Please fill all fields", variant: "destructive" });
            return;
        }
        setStep("coupon");
    };

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponStatus("loading");

        try {
            const coupons = await sanityClient.fetch(
                `*[_type == "coupon" && code == $code && isActive == true][0]{ code, discountPercent, description }`,
                { code: couponCode.trim().toUpperCase() }
            );

            if (coupons) {
                setDiscount(coupons.discountPercent);
                setCouponDescription(coupons.description || `${coupons.discountPercent}% off`);
                setCouponStatus("valid");
                toast({ title: "Coupon Applied!", description: `${coupons.discountPercent}% discount applied.` });
            } else {
                setCouponStatus("invalid");
                setDiscount(0);
                setCouponDescription("");
                toast({ title: "Invalid Coupon", description: "This coupon code is not valid.", variant: "destructive" });
            }
        } catch (err) {
            setCouponStatus("invalid");
            toast({ title: "Error", description: "Failed to validate coupon. Try again.", variant: "destructive" });
        }
    };

    const removeCoupon = () => {
        setCouponCode("");
        setCouponStatus("idle");
        setDiscount(0);
        setCouponDescription("");
    };

    const handleProceedToPay = async () => {
        try {
            // Create order via Cloudflare Worker (server-side, keys are secure)
            const orderRes = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: finalPrice,
                    planName,
                    customerName: formData.name,
                    customerEmail: formData.email,
                    customerPhone: formData.phone,
                    couponCode: couponCode || null,
                    discountPercent: discount || 0,
                }),
            });

            if (!orderRes.ok) throw new Error("Failed to create order");
            const order = await orderRes.json();

            // Load Razorpay Checkout.js dynamically
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                const options = {
                    key: order.keyId,
                    amount: order.amount,
                    currency: order.currency,
                    order_id: order.id,
                    name: "Marichi World",
                    description: `${planName} Plan`,
                    handler: async function (response: any) {
                        // Verify payment server-side
                        try {
                            await fetch(`${API_BASE_URL}/api/payment/verify`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                }),
                            });
                        } catch (verifyErr) {
                            console.warn("Payment verification failed:", verifyErr);
                        }

                        toast({
                            title: "Payment Successful! 🎉",
                            description: `Payment ID: ${response.razorpay_payment_id}`,
                        });

                        // Send confirmation email via mailto
                        const subject = encodeURIComponent(`Payment Confirmation - ${planName}`);
                        const body = encodeURIComponent(
                            `Hello,\n\nPayment Details:\nPlan: ${planName}\nAmount: ₹${finalPrice.toLocaleString("en-IN")}\nPayment ID: ${response.razorpay_payment_id}\n\nCustomer:\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n${discount > 0 ? `Coupon: ${couponCode} (${discount}% off)\n` : ""}`
                        );
                        const mailtoLink = `mailto:manisha@globalcoachforyou.com?subject=${subject}&body=${body}`;
                        const a = document.createElement("a");
                        a.href = mailtoLink;
                        a.target = "_blank";
                        a.rel = "noopener noreferrer";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);

                        onClose();
                        resetModal();
                    },
                    prefill: {
                        name: formData.name,
                        email: formData.email,
                        contact: formData.phone,
                    },
                    theme: {
                        color: "#0d9488",
                    },
                    modal: {
                        ondismiss: function () {
                            toast({ title: "Payment Cancelled", description: "You can try again anytime." });
                        },
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            };
            document.body.appendChild(script);
        } catch (err) {
            console.error("Payment error:", err);
            toast({
                title: "Payment Error",
                description: "Failed to initiate payment. Please try again.",
                variant: "destructive",
            });
        }
    };

    const resetModal = () => {
        setStep("form");
        setFormData({ name: "", email: "", phone: "" });
        setCouponCode("");
        setCouponStatus("idle");
        setDiscount(0);
        setCouponDescription("");
    };

    const handleClose = () => {
        onClose();
        resetModal();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-teal-600 to-emerald-500 p-6 text-white">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <h3 className="text-xl font-bold">{planName}</h3>
                        <div className="flex items-baseline gap-2 mt-2">
                            {discount > 0 ? (
                                <>
                                    <span className="text-2xl font-bold">₹{finalPrice.toLocaleString("en-IN")}</span>
                                    <span className="text-sm line-through opacity-70">₹{price.toLocaleString("en-IN")}</span>
                                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{discount}% OFF</span>
                                </>
                            ) : (
                                <span className="text-2xl font-bold">₹{price.toLocaleString("en-IN")}</span>
                            )}
                        </div>
                        {/* Progress Steps */}
                        <div className="flex gap-2 mt-4">
                            {["Details", "Coupon", "Pay"].map((label, i) => (
                                <div key={label} className="flex items-center gap-1">
                                    <div
                                        className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${(step === "form" && i === 0) || (step === "coupon" && i === 1) || (step === "pay" && i === 2)
                                            ? "bg-white text-teal-600"
                                            : (step === "coupon" && i === 0) || (step === "pay" && (i === 0 || i === 1))
                                                ? "bg-white/40 text-white"
                                                : "bg-white/20 text-white/60"
                                            }`}
                                    >
                                        {(step === "coupon" && i === 0) || (step === "pay" && (i === 0 || i === 1)) ? "✓" : i + 1}
                                    </div>
                                    <span className="text-xs text-white/80 hidden sm:inline">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {step === "form" && (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleFormSubmit}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="purchase-name">Full Name *</Label>
                                        <Input
                                            id="purchase-name"
                                            placeholder="Your full name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="purchase-email">Email *</Label>
                                        <Input
                                            id="purchase-email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="purchase-phone">Phone Number *</Label>
                                        <Input
                                            id="purchase-phone"
                                            type="tel"
                                            placeholder="+91 98336 57889"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white border-0"
                                    >
                                        Continue
                                    </Button>
                                </motion.form>
                            )}

                            {step === "coupon" && (
                                <motion.div
                                    key="coupon"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="coupon-code" className="flex items-center gap-2">
                                            <Tag className="h-4 w-4" /> Have a coupon code?
                                        </Label>
                                        {couponStatus === "valid" ? (
                                            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-green-700 dark:text-green-400">{couponCode.toUpperCase()}</p>
                                                    <p className="text-xs text-green-600 dark:text-green-500">{couponDescription}</p>
                                                </div>
                                                <button onClick={removeCoupon} className="text-green-600 hover:text-red-500 transition">
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Input
                                                    id="coupon-code"
                                                    placeholder="Enter coupon code"
                                                    value={couponCode}
                                                    onChange={(e) => {
                                                        setCouponCode(e.target.value.toUpperCase());
                                                        if (couponStatus === "invalid") setCouponStatus("idle");
                                                    }}
                                                    className={couponStatus === "invalid" ? "border-red-500" : ""}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={applyCoupon}
                                                    disabled={couponStatus === "loading" || !couponCode.trim()}
                                                    className="shrink-0"
                                                >
                                                    {couponStatus === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                                                </Button>
                                            </div>
                                        )}
                                        {couponStatus === "invalid" && (
                                            <p className="text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" /> Invalid or expired coupon code
                                            </p>
                                        )}
                                    </div>

                                    {/* Price Summary */}
                                    <div className="border-t border-border pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Plan Price</span>
                                            <span>₹{price.toLocaleString("en-IN")}</span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex justify-between text-sm text-green-600">
                                                <span>Discount ({discount}%)</span>
                                                <span>-₹{Math.round((price * discount) / 100).toLocaleString("en-IN")}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                                            <span>Total</span>
                                            <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                                                ₹{finalPrice.toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button variant="outline" onClick={() => setStep("form")} className="flex-1">
                                            Back
                                        </Button>
                                        <Button
                                            onClick={handleProceedToPay}
                                            className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-500 text-white border-0"
                                        >
                                            Proceed to Pay
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

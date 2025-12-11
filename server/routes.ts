import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createOrderSchema, verifyPaymentSchema } from "@shared/schema";
import crypto from "crypto";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/payment/create-order", async (req, res) => {
    try {
      const validatedData = createOrderSchema.parse(req.body);
      
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (!keyId || !keySecret) {
        return res.status(500).json({ error: "Payment gateway not configured" });
      }

      const amountInPaise = validatedData.amount * 100;

      const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        }),
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error("Razorpay order error:", errorText);
        return res.status(500).json({ error: "Failed to create order" });
      }

      const order = await orderResponse.json();

      await storage.createPayment({
        orderId: order.id,
        amount: validatedData.amount,
        currency: "INR",
        planName: validatedData.planName,
        category: validatedData.category,
        status: "created",
        paymentId: null,
        customerName: null,
        customerEmail: null,
        customerPhone: null,
      });

      res.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: keyId,
      });
    } catch (error) {
      console.error("Create order error:", error);
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.post("/api/payment/verify", async (req, res) => {
    try {
      const validatedData = verifyPaymentSchema.parse(req.body);
      
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (!keySecret) {
        return res.status(500).json({ error: "Payment gateway not configured" });
      }

      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${validatedData.razorpay_order_id}|${validatedData.razorpay_payment_id}`)
        .digest("hex");

      if (expectedSignature === validatedData.razorpay_signature) {
        await storage.updatePaymentStatus(
          validatedData.razorpay_order_id,
          "paid",
          validatedData.razorpay_payment_id
        );

        res.json({ success: true, message: "Payment verified successfully" });
      } else {
        await storage.updatePaymentStatus(validatedData.razorpay_order_id, "failed");
        res.status(400).json({ error: "Invalid signature" });
      }
    } catch (error) {
      console.error("Verify payment error:", error);
      res.status(400).json({ error: "Invalid request" });
    }
  });

  return httpServer;
}

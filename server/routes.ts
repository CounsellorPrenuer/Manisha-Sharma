import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createOrderSchema, verifyPaymentSchema, contactFormSchema, newsletterSchema, buttonClickSchema, reviewSchema, blogPostSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_upload = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage_upload });
import crypto from "crypto";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactFormSchema.parse(req.body);
      const contact = await storage.createContact({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        subject: validatedData.subject,
        message: validatedData.message,
      });
      res.json({ success: true, id: contact.id });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = newsletterSchema.parse(req.body);
      const subscriber = await storage.createSubscriber(validatedData.email);
      res.json({ success: true, id: subscriber.id });
    } catch (error) {
      console.error("Newsletter error:", error);
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.post("/api/track-click", async (req, res) => {
    try {
      const validatedData = buttonClickSchema.parse(req.body);
      const click = await storage.trackButtonClick(
        validatedData.buttonId,
        validatedData.buttonName,
        validatedData.section
      );
      res.json({ success: true, clicks: click.clickCount });
    } catch (error) {
      console.error("Track click error:", error);
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Admin stats error:", error);
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  app.get("/api/admin/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Admin contacts error:", error);
      res.status(500).json({ error: "Failed to get contacts" });
    }
  });

  app.get("/api/admin/subscribers", async (req, res) => {
    try {
      const subscribers = await storage.getAllSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Admin subscribers error:", error);
      res.status(500).json({ error: "Failed to get subscribers" });
    }
  });

  app.get("/api/admin/payments", async (req, res) => {
    try {
      const payments = await storage.getAllPayments();
      res.json(payments.map(p => ({
        ...p,
        packageName: p.planName,
        email: p.customerEmail || "N/A",
      })));
    } catch (error) {
      console.error("Admin payments error:", error);
      res.status(500).json({ error: "Failed to get payments" });
    }
  });

  app.get("/api/admin/button-clicks", async (req, res) => {
    try {
      const clicks = await storage.getAllButtonClicks();
      res.json(clicks);
    } catch (error) {
      console.error("Admin button clicks error:", error);
      res.status(500).json({ error: "Failed to get button clicks" });
    }
  });

  // Reviews CRUD
  app.get("/api/admin/reviews", async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Admin reviews error:", error);
      res.status(500).json({ error: "Failed to get reviews" });
    }
  });

  app.post("/api/admin/reviews", async (req, res) => {
    try {
      const validatedData = reviewSchema.parse(req.body);
      const review = await storage.createReview({
        name: validatedData.name,
        role: validatedData.role,
        company: validatedData.company,
        content: validatedData.content,
        rating: validatedData.rating,
        imageUrl: validatedData.imageUrl || null,
        isActive: validatedData.isActive ?? true,
      });
      res.json(review);
    } catch (error) {
      console.error("Create review error:", error);
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.patch("/api/admin/reviews/:id", async (req, res) => {
    try {
      const review = await storage.updateReview(req.params.id, req.body);
      if (review) {
        res.json(review);
      } else {
        res.status(404).json({ error: "Review not found" });
      }
    } catch (error) {
      console.error("Update review error:", error);
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.delete("/api/admin/reviews/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteReview(req.params.id);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Review not found" });
      }
    } catch (error) {
      console.error("Delete review error:", error);
      res.status(500).json({ error: "Failed to delete review" });
    }
  });

  // Blog Posts CRUD
  app.get("/api/admin/blogs", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Admin blogs error:", error);
      res.status(500).json({ error: "Failed to get blog posts" });
    }
  });

  app.post("/api/admin/blogs", async (req, res) => {
    try {
      const validatedData = blogPostSchema.parse(req.body);
      const post = await storage.createBlogPost({
        title: validatedData.title,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        category: validatedData.category,
        imageUrl: validatedData.imageUrl || null,
        author: validatedData.author || "Manisha Sharma",
        readTime: validatedData.readTime || "5 min read",
        isPublished: validatedData.isPublished ?? false,
      });
      res.json(post);
    } catch (error) {
      console.error("Create blog error:", error);
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.patch("/api/admin/blogs/:id", async (req, res) => {
    try {
      const post = await storage.updateBlogPost(req.params.id, req.body);
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ error: "Blog post not found" });
      }
    } catch (error) {
      console.error("Update blog error:", error);
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.delete("/api/admin/blogs/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteBlogPost(req.params.id);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Blog post not found" });
      }
    } catch (error) {
      console.error("Delete blog error:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // Image Upload
  app.post("/api/upload", upload.single("image"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", (await import("express")).default.static(uploadDir));

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

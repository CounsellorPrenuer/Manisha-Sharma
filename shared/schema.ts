import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: text("order_id").notNull(),
  paymentId: text("payment_id"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("INR"),
  planName: text("plan_name").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull().default("created"),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  createdAt: text("created_at").notNull().default(sql`now()`),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export const createOrderSchema = z.object({
  amount: z.number().positive(),
  planName: z.string(),
  category: z.string(),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
}

export interface ButtonClick {
  id: string;
  buttonId: string;
  buttonName: string;
  section: string;
  clickCount: number;
  lastClicked: string;
}

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const buttonClickSchema = z.object({
  buttonId: z.string(),
  buttonName: z.string(),
  section: z.string(),
});

export interface Review {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string | null;
  author: string;
  readTime: string;
  isPublished: boolean;
  createdAt: string;
}

export const reviewSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  company: z.string().min(2),
  content: z.string().min(10),
  rating: z.number().min(1).max(5),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const blogPostSchema = z.object({
  title: z.string().min(5),
  excerpt: z.string().min(10),
  content: z.string().min(50),
  category: z.string(),
  imageUrl: z.string().optional(),
  author: z.string().default("Manisha Sharma"),
  readTime: z.string().default("5 min read"),
  isPublished: z.boolean().default(false),
});

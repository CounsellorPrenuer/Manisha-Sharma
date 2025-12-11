import { type User, type InsertUser, type Payment, type InsertPayment, type ContactSubmission, type NewsletterSubscription, type ButtonClick, type Review, type BlogPost } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentByOrderId(orderId: string): Promise<Payment | undefined>;
  updatePaymentStatus(orderId: string, status: string, paymentId?: string): Promise<Payment | undefined>;
  getAllPayments(): Promise<Payment[]>;
  createContact(contact: Omit<ContactSubmission, "id" | "status" | "createdAt">): Promise<ContactSubmission>;
  getAllContacts(): Promise<ContactSubmission[]>;
  createSubscriber(email: string): Promise<NewsletterSubscription>;
  getAllSubscribers(): Promise<NewsletterSubscription[]>;
  trackButtonClick(buttonId: string, buttonName: string, section: string): Promise<ButtonClick>;
  getAllButtonClicks(): Promise<ButtonClick[]>;
  getStats(): Promise<{
    totalVisitors: number;
    totalClicks: number;
    totalContacts: number;
    totalSubscribers: number;
    totalPayments: number;
    totalRevenue: number;
    conversionRate: number;
    popularButtons: { name: string; clicks: number }[];
  }>;
  createReview(review: Omit<Review, "id" | "createdAt">): Promise<Review>;
  getAllReviews(): Promise<Review[]>;
  updateReview(id: string, data: Partial<Review>): Promise<Review | undefined>;
  deleteReview(id: string): Promise<boolean>;
  createBlogPost(post: Omit<BlogPost, "id" | "createdAt">): Promise<BlogPost>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private payments: Map<string, Payment>;
  private contacts: Map<string, ContactSubmission>;
  private subscribers: Map<string, NewsletterSubscription>;
  private buttonClicks: Map<string, ButtonClick>;
  private reviews: Map<string, Review>;
  private blogPosts: Map<string, BlogPost>;
  private visitorCount: number;

  constructor() {
    this.users = new Map();
    this.payments = new Map();
    this.contacts = new Map();
    this.subscribers = new Map();
    this.buttonClicks = new Map();
    this.reviews = new Map();
    this.blogPosts = new Map();
    this.visitorCount = 0;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = {
      id,
      orderId: insertPayment.orderId,
      paymentId: insertPayment.paymentId ?? null,
      amount: insertPayment.amount,
      currency: insertPayment.currency ?? "INR",
      planName: insertPayment.planName,
      category: insertPayment.category,
      status: insertPayment.status ?? "created",
      customerName: insertPayment.customerName ?? null,
      customerEmail: insertPayment.customerEmail ?? null,
      customerPhone: insertPayment.customerPhone ?? null,
      createdAt: new Date().toISOString(),
    };
    this.payments.set(insertPayment.orderId, payment);
    return payment;
  }

  async getPaymentByOrderId(orderId: string): Promise<Payment | undefined> {
    return this.payments.get(orderId);
  }

  async updatePaymentStatus(orderId: string, status: string, paymentId?: string): Promise<Payment | undefined> {
    const payment = this.payments.get(orderId);
    if (payment) {
      payment.status = status;
      if (paymentId) {
        payment.paymentId = paymentId;
      }
      this.payments.set(orderId, payment);
    }
    return payment;
  }

  async getAllPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createContact(contact: Omit<ContactSubmission, "id" | "status" | "createdAt">): Promise<ContactSubmission> {
    const id = randomUUID();
    const submission: ContactSubmission = {
      id,
      ...contact,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    this.contacts.set(id, submission);
    return submission;
  }

  async getAllContacts(): Promise<ContactSubmission[]> {
    return Array.from(this.contacts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createSubscriber(email: string): Promise<NewsletterSubscription> {
    const existing = Array.from(this.subscribers.values()).find(s => s.email === email);
    if (existing) {
      return existing;
    }
    
    const id = randomUUID();
    const subscriber: NewsletterSubscription = {
      id,
      email,
      isActive: true,
      subscribedAt: new Date().toISOString(),
    };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }

  async getAllSubscribers(): Promise<NewsletterSubscription[]> {
    return Array.from(this.subscribers.values()).sort((a, b) => 
      new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime()
    );
  }

  async trackButtonClick(buttonId: string, buttonName: string, section: string): Promise<ButtonClick> {
    const existing = this.buttonClicks.get(buttonId);
    if (existing) {
      existing.clickCount++;
      existing.lastClicked = new Date().toISOString();
      this.buttonClicks.set(buttonId, existing);
      return existing;
    }

    const id = randomUUID();
    const click: ButtonClick = {
      id,
      buttonId,
      buttonName,
      section,
      clickCount: 1,
      lastClicked: new Date().toISOString(),
    };
    this.buttonClicks.set(buttonId, click);
    return click;
  }

  async getAllButtonClicks(): Promise<ButtonClick[]> {
    return Array.from(this.buttonClicks.values()).sort((a, b) => b.clickCount - a.clickCount);
  }

  async getStats(): Promise<{
    totalVisitors: number;
    totalClicks: number;
    totalContacts: number;
    totalSubscribers: number;
    totalPayments: number;
    totalRevenue: number;
    conversionRate: number;
    popularButtons: { name: string; clicks: number }[];
  }> {
    this.visitorCount++;
    
    const allClicks = await this.getAllButtonClicks();
    const totalClicks = allClicks.reduce((sum, c) => sum + c.clickCount, 0);
    
    const payments = await this.getAllPayments();
    const completedPayments = payments.filter(p => p.status === "paid");
    const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
    
    const popularButtons = allClicks.slice(0, 5).map(c => ({
      name: c.buttonName,
      clicks: c.clickCount,
    }));

    const conversionRate = this.visitorCount > 0 
      ? Math.round((completedPayments.length / this.visitorCount) * 100) 
      : 0;

    return {
      totalVisitors: this.visitorCount,
      totalClicks,
      totalContacts: this.contacts.size,
      totalSubscribers: this.subscribers.size,
      totalPayments: completedPayments.length,
      totalRevenue,
      conversionRate,
      popularButtons,
    };
  }

  async createReview(review: Omit<Review, "id" | "createdAt">): Promise<Review> {
    const id = randomUUID();
    const newReview: Review = {
      id,
      ...review,
      createdAt: new Date().toISOString(),
    };
    this.reviews.set(id, newReview);
    return newReview;
  }

  async getAllReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updateReview(id: string, data: Partial<Review>): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (review) {
      const updated = { ...review, ...data };
      this.reviews.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteReview(id: string): Promise<boolean> {
    return this.reviews.delete(id);
  }

  async createBlogPost(post: Omit<BlogPost, "id" | "createdAt">): Promise<BlogPost> {
    const id = randomUUID();
    const newPost: BlogPost = {
      id,
      ...post,
      createdAt: new Date().toISOString(),
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (post) {
      const updated = { ...post, ...data };
      this.blogPosts.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }
}

export const storage = new MemStorage();

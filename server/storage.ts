import { type User, type InsertUser, type Payment, type InsertPayment } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentByOrderId(orderId: string): Promise<Payment | undefined>;
  updatePaymentStatus(orderId: string, status: string, paymentId?: string): Promise<Payment | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private payments: Map<string, Payment>;

  constructor() {
    this.users = new Map();
    this.payments = new Map();
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
}

export const storage = new MemStorage();

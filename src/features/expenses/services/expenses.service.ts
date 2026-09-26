import { firestoreClient } from "@/lib/firebase/firestore-client";
import type { Expense } from "@/types";
import type { ExpenseInput } from "@/lib/validations/schemas";

function toExpense(record: Record<string, string>): Expense {
  return {
    id: record.id,
    date: record.date,
    description: record.description,
    categoryId: record.categoryId,
    paymentMethod: record.paymentMethod as Expense["paymentMethod"],
    amount: Number(record.amount) || 0,
    notes: record.notes || undefined,
  };
}

function toRecord(input: ExpenseInput): Record<string, string> {
  return {
    date: input.date,
    description: input.description,
    categoryId: input.categoryId,
    paymentMethod: input.paymentMethod,
    amount: String(input.amount),
    notes: input.notes ?? "",
  };
}

export const expensesService = {
  async list(userId: string): Promise<Expense[]> {
    const rows = await firestoreClient.list("expenses", userId);
    return rows.map(toExpense).sort((a, b) => (a.date < b.date ? 1 : -1));
  },

  async create(userId: string, input: ExpenseInput): Promise<Expense> {
    const record = await firestoreClient.create("expenses", userId, toRecord(input));
    return toExpense(record);
  },

  async update(userId: string, id: string, input: ExpenseInput): Promise<Expense | null> {
    const record = await firestoreClient.update("expenses", userId, id, toRecord(input));
    return record ? toExpense(record) : null;
  },

  async remove(userId: string, id: string): Promise<boolean> {
    return firestoreClient.remove("expenses", userId, id);
  },
};

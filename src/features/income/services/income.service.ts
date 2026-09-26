import { firestoreClient } from "@/lib/firebase/firestore-client";
import type { Income } from "@/types";
import type { IncomeInput } from "@/lib/validations/schemas";

function toIncome(record: Record<string, string>): Income {
  return {
    id: record.id,
    date: record.date,
    source: record.source,
    description: record.description,
    amount: Number(record.amount) || 0,
    notes: record.notes || undefined,
  };
}

function toRecord(input: IncomeInput): Record<string, string> {
  return {
    date: input.date,
    source: input.source,
    description: input.description,
    amount: String(input.amount),
    notes: input.notes ?? "",
  };
}

export const incomeService = {
  async list(userId: string): Promise<Income[]> {
    const rows = await firestoreClient.list("income", userId);
    return rows.map(toIncome).sort((a, b) => (a.date < b.date ? 1 : -1));
  },

  async create(userId: string, input: IncomeInput): Promise<Income> {
    const record = await firestoreClient.create("income", userId, toRecord(input));
    return toIncome(record);
  },

  async update(userId: string, id: string, input: IncomeInput): Promise<Income | null> {
    const record = await firestoreClient.update("income", userId, id, toRecord(input));
    return record ? toIncome(record) : null;
  },

  async remove(userId: string, id: string): Promise<boolean> {
    return firestoreClient.remove("income", userId, id);
  },
};

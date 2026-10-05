import { randomUUID } from "node:crypto";
import { addMonths, format, parseISO } from "date-fns";
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
    installmentGroupId: record.installmentGroupId || undefined,
    installmentNumber: record.installmentNumber ? Number(record.installmentNumber) : undefined,
    installmentTotal: record.installmentTotal ? Number(record.installmentTotal) : undefined,
    purchaseAmount: record.purchaseAmount ? Number(record.purchaseAmount) : undefined,
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

// Divide o valor total em N parcelas de 2 casas decimais, jogando o
// arredondamento restante na última parcela — assim a soma das parcelas bate
// exatamente com o valor total da compra.
function splitAmount(total: number, installments: number): number[] {
  const base = Math.floor((total / installments) * 100) / 100;
  const amounts = Array(installments).fill(base);
  const distributed = base * installments;
  const remainder = Math.round((total - distributed) * 100) / 100;
  amounts[installments - 1] = Math.round((amounts[installments - 1] + remainder) * 100) / 100;
  return amounts;
}

export const expensesService = {
  async list(userId: string): Promise<Expense[]> {
    const rows = await firestoreClient.list("expenses", userId);
    return rows.map(toExpense).sort((a, b) => (a.date < b.date ? 1 : -1));
  },

  // Cria um gasto único (à vista) ou, se input.installments > 1, explode a
  // compra em N lançamentos mensais — um por parcela — todos ligados por um
  // installmentGroupId. Cada parcela é um documento independente, então o
  // dashboard soma o mês certo automaticamente, sem lógica especial.
  async create(userId: string, input: ExpenseInput): Promise<Expense[]> {
    const installments = input.installments ?? 1;

    if (installments <= 1) {
      const record = await firestoreClient.create("expenses", userId, toRecord(input));
      return [toExpense(record)];
    }

    const groupId = randomUUID();
    const amounts = splitAmount(input.amount, installments);
    const baseDate = parseISO(input.date);

    const created = await Promise.all(
      amounts.map((amount, index) => {
        const date = format(addMonths(baseDate, index), "yyyy-MM-dd");
        const record = {
          ...toRecord(input),
          date,
          amount: String(amount),
          installmentGroupId: groupId,
          installmentNumber: String(index + 1),
          installmentTotal: String(installments),
          purchaseAmount: String(input.amount),
        };
        return firestoreClient.create("expenses", userId, record);
      })
    );

    return created.map(toExpense).sort((a, b) => (a.date < b.date ? 1 : -1));
  },

  async update(userId: string, id: string, input: ExpenseInput): Promise<Expense | null> {
    const record = await firestoreClient.update("expenses", userId, id, toRecord(input));
    return record ? toExpense(record) : null;
  },

  async remove(userId: string, id: string): Promise<boolean> {
    return firestoreClient.remove("expenses", userId, id);
  },

  // Remove todas as parcelas de um grupo com installmentNumber >= fromNumber
  // (usado por "excluir esta e as futuras"). fromNumber = 1 remove o grupo
  // inteiro.
  async removeInstallmentsFrom(
    userId: string,
    groupId: string,
    fromNumber: number
  ): Promise<number> {
    const rows = await firestoreClient.listByField(
      "expenses",
      userId,
      "installmentGroupId",
      groupId
    );
    const toDelete = rows.filter((r) => Number(r.installmentNumber) >= fromNumber);
    await Promise.all(toDelete.map((r) => firestoreClient.remove("expenses", userId, r.id)));
    return toDelete.length;
  },
};

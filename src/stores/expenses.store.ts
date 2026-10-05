import { create } from "zustand";
import type { Expense } from "@/types";
import type { ExpenseInput } from "@/lib/validations/schemas";
import { apiClient } from "@/lib/api/client";
import { isArray } from "node:util";

interface ExpensesState {
  items: Expense[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (input: ExpenseInput) => Promise<boolean>;
  update: (id: string, input: ExpenseInput) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  removeInstallmentsFrom: (groupId: string, from: number) => Promise<boolean>;
}

export const useExpensesStore = create<ExpensesState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  refresh: async () => {
    set({ loading: true, error: null });
    try {
      const items = await apiClient.get<Expense[]>("/api/expenses");
      set({ items, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : "Erro ao carregar gastos",
      });
    }
  },

  create: async (input) => {
    set({ error: null });
    try {
      const created = await apiClient.post<Expense[]>("/api/expenses", input);

      // O endpoint sempre retorna um array: 1 item para compra à vista, N
      // para parcelada (uma por mês).
      const newItems = Array.isArray(created) ? created : [created];

      set({ items: [...newItems, ...get().items] });
      return true;
    } catch (err) {
      console.log(err);
      set({ error: err instanceof Error ? err.message : "Erro ao criar gasto" });
      return false;
    }
  },

  update: async (id, input) => {
    set({ error: null });
    try {
      const updated = await apiClient.put<Expense>(`/api/expenses/${id}`, input);
      set({
        items: get().items.map((item) => (item.id === id ? updated : item)),
      });
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Erro ao atualizar gasto" });
      return false;
    }
  },

  remove: async (id) => {
    set({ error: null });
    try {
      await apiClient.delete(`/api/expenses/${id}`);
      set({ items: get().items.filter((item) => item.id !== id) });
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Erro ao excluir gasto" });
      return false;
    }
  },

  removeInstallmentsFrom: async (groupId, from) => {
    set({ error: null });
    try {
      await apiClient.delete(`/api/expenses?groupId=${groupId}&from=${from}`);
      set({
        items: get().items.filter(
          (item) => !(item.installmentGroupId === groupId && (item.installmentNumber ?? 0) >= from)
        ),
      });
      return true;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Erro ao excluir parcelas",
      });
      return false;
    }
  },
}));

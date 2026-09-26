import { create } from "zustand";
import type { Income } from "@/types";
import type { IncomeInput } from "@/lib/validations/schemas";
import { apiClient } from "@/lib/api/client";

interface IncomeState {
  items: Income[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (input: IncomeInput) => Promise<boolean>;
  update: (id: string, input: IncomeInput) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
}

export const useIncomeStore = create<IncomeState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  refresh: async () => {
    set({ loading: true, error: null });
    try {
      const items = await apiClient.get<Income[]>("/api/income");
      set({ items, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : "Erro ao carregar entradas",
      });
    }
  },

  create: async (input) => {
    set({ error: null });
    try {
      const created = await apiClient.post<Income>("/api/income", input);
      set({ items: [created, ...get().items] });
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Erro ao criar entrada" });
      return false;
    }
  },

  update: async (id, input) => {
    set({ error: null });
    try {
      const updated = await apiClient.put<Income>(`/api/income/${id}`, input);
      set({
        items: get().items.map((item) => (item.id === id ? updated : item)),
      });
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Erro ao atualizar entrada" });
      return false;
    }
  },

  remove: async (id) => {
    set({ error: null });
    try {
      await apiClient.delete(`/api/income/${id}`);
      set({ items: get().items.filter((item) => item.id !== id) });
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Erro ao excluir entrada" });
      return false;
    }
  },
}));

import { create } from "zustand";
import type { Category } from "@/types";
import type { CategoryInput } from "@/lib/validations/schemas";
import { apiClient } from "@/lib/api/client";

interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (input: CategoryInput) => Promise<boolean>;
  update: (id: string, input: CategoryInput) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  refresh: async () => {
    set({ loading: true, error: null });
    try {
      const items = await apiClient.get<Category[]>("/api/categories");
      set({ items, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : "Erro ao carregar categorias",
      });
    }
  },

  create: async (input) => {
    set({ error: null });
    try {
      const created = await apiClient.post<Category>("/api/categories", input);
      set({ items: [...get().items, created] });
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Erro ao criar categoria" });
      return false;
    }
  },

  update: async (id, input) => {
    set({ error: null });
    try {
      const updated = await apiClient.put<Category>(`/api/categories/${id}`, input);
      set({
        items: get().items.map((item) => (item.id === id ? updated : item)),
      });
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Erro ao atualizar categoria" });
      return false;
    }
  },

  remove: async (id) => {
    set({ error: null });
    try {
      await apiClient.delete(`/api/categories/${id}`);
      set({ items: get().items.filter((item) => item.id !== id) });
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Erro ao excluir categoria" });
      return false;
    }
  },
}));

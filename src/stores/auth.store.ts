import { create } from "zustand";
import type { User } from "@/types";
import { apiClient } from "@/lib/api/client";

interface AuthState {
  user: User | null;
  loading: boolean;
  hydrated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  hydrated: false,
  error: null,

  hydrate: async () => {
    try {
      const data = await apiClient.get<{ user: User }>("/api/auth/me");
      set({ user: data.user, hydrated: true });
    } catch {
      set({ user: null, hydrated: true });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.post<{ user: User }>("/api/auth/login", {
        email,
        password,
      });
      set({ user: data.user, loading: false, hydrated: true });
      return true;
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : "Erro ao entrar",
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await apiClient.post("/api/auth/logout", {});
    } finally {
      set({ user: null });
    }
  },
}));

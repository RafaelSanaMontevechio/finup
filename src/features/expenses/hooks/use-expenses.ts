"use client";

import { useEffect, useMemo, useState } from "react";
import { useExpensesStore } from "@/stores/expenses.store";
import type { PaymentMethod } from "@/types";

export interface ExpenseFilters {
  search: string;
  categoryId: string | "all";
  month: string | "all"; // "YYYY-MM"
  sortBy: "date-desc" | "date-asc" | "amount-desc" | "amount-asc";
}

const DEFAULT_FILTERS: ExpenseFilters = {
  search: "",
  categoryId: "all",
  month: "all",
  sortBy: "date-desc",
};

export function useExpenses() {
  const { items, loading, error, refresh, create, update, remove, removeInstallmentsFrom } =
    useExpensesStore();
  const [filters, setFilters] = useState<ExpenseFilters>(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    let list = [...items];

    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (e) => e.description.toLowerCase().includes(q) || (e.notes ?? "").toLowerCase().includes(q)
      );
    }

    if (filters.categoryId !== "all") {
      list = list.filter((e) => e.categoryId === filters.categoryId);
    }

    if (filters.month !== "all") {
      list = list.filter((e) => e.date.startsWith(filters.month));
    }

    list.sort((a, b) => {
      switch (filters.sortBy) {
        case "date-asc":
          return a.date < b.date ? -1 : 1;
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        case "date-desc":
        default:
          return a.date < b.date ? 1 : -1;
      }
    });

    return list;
  }, [items, filters]);

  useEffect(() => {
    if (items.length === 0) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    expenses: filtered,
    allExpenses: items,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
    removeInstallmentsFrom,
    filters,
    setFilters,
  };
}

export type { PaymentMethod };

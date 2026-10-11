"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

const PAGE_SIZE = 10;

export function useExpenses() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ExpenseFilters>(DEFAULT_FILTERS);

  const { items, loading, error, refresh, create, update, remove } = useExpensesStore();

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePagination = useCallback((page: number) => {
    setCurrentPage(page < 1 ? 1 : page > totalPages ? totalPages : page);
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    expenses: paged,
    allExpenses: items,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
    filters,
    setFilters,
    totalPages,
    currentPage,
    handlePagination,
  };
}

export type { PaymentMethod };

"use client";

import { useEffect, useMemo, useState } from "react";
import { useIncomeStore } from "@/stores/income.store";

export interface IncomeFilters {
  search: string;
  month: string | "all";
  sortBy: "date-desc" | "date-asc" | "amount-desc" | "amount-asc";
}

const DEFAULT_FILTERS: IncomeFilters = {
  search: "",
  month: "all",
  sortBy: "date-desc",
};

export function useIncome() {
  const { items, loading, error, refresh, create, update, remove } = useIncomeStore();
  const [filters, setFilters] = useState<IncomeFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    if (items.length === 0) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let list = [...items];

    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.description.toLowerCase().includes(q) ||
          e.source.toLowerCase().includes(q) ||
          (e.notes ?? "").toLowerCase().includes(q)
      );
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

  return {
    income: filtered,
    allIncome: items,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
    filters,
    setFilters,
  };
}

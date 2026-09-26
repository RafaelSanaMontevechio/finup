"use client";

import { useEffect } from "react";
import { useCategoriesStore } from "@/stores/categories.store";

export function useCategories() {
  const { items, loading, error, refresh, create, update, remove } =
    useCategoriesStore();

  useEffect(() => {
    if (items.length === 0) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { categories: items, loading, error, refresh, create, update, remove };
}

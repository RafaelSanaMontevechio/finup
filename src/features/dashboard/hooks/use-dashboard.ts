"use client";

import { useEffect, useMemo } from "react";
import { useExpensesStore } from "@/stores/expenses.store";
import { useIncomeStore } from "@/stores/income.store";
import { useCategoriesStore } from "@/stores/categories.store";
import {
  calculateBalance,
  calculateMonthlyTotals,
  groupExpensesByCategory,
  sumAmounts,
  averageTicket,
  topCategory,
  mostFrequentCategory,
} from "@/features/dashboard/utils/calculations";

export function useDashboard() {
  const expensesStore = useExpensesStore();
  const incomeStore = useIncomeStore();
  const categoriesStore = useCategoriesStore();

  useEffect(() => {
    if (expensesStore.items.length === 0) expensesStore.refresh();
    if (incomeStore.items.length === 0) incomeStore.refresh();
    if (categoriesStore.items.length === 0) categoriesStore.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading = expensesStore.loading || incomeStore.loading || categoriesStore.loading;

  const stats = useMemo(() => {
    const totalIncome = sumAmounts(incomeStore.items);
    const totalExpenses = sumAmounts(expensesStore.items);
    const balance = calculateBalance(incomeStore.items, expensesStore.items);
    const categoryTotals = groupExpensesByCategory(expensesStore.items, categoriesStore.items);
    const monthlyTotals = calculateMonthlyTotals(incomeStore.items, expensesStore.items, 6);
    const recentExpenses = [...expensesStore.items]
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, 5);
    const recentIncome = [...incomeStore.items]
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, 5);

    return {
      totalIncome,
      totalExpenses,
      balance,
      entryCount: expensesStore.items.length + incomeStore.items.length,
      categoryTotals,
      monthlyTotals,
      recentExpenses,
      recentIncome,
      averageTicket: averageTicket(expensesStore.items),
      topCategory: topCategory(categoryTotals),
      mostFrequentCategory: mostFrequentCategory(categoryTotals),
    };
  }, [expensesStore.items, incomeStore.items, categoriesStore.items]);

  return { loading, categories: categoriesStore.items, ...stats };
}

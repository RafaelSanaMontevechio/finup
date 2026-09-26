import type { Category, Expense, Income } from "@/types";
import { toMonthKey, monthLabel } from "@/lib/utils/format";

export function sumAmounts(items: { amount: number }[]): number {
  return items.reduce((total, item) => total + item.amount, 0);
}

export function calculateBalance(income: Income[], expenses: Expense[]): number {
  return sumAmounts(income) - sumAmounts(expenses);
}

export interface CategoryTotal {
  categoryId: string;
  name: string;
  color: string;
  total: number;
  percentage: number;
  count: number;
}

export function groupExpensesByCategory(
  expenses: Expense[],
  categories: Category[]
): CategoryTotal[] {
  const totalAmount = sumAmounts(expenses) || 1;
  const map = new Map<string, { total: number; count: number }>();

  for (const expense of expenses) {
    const current = map.get(expense.categoryId) ?? { total: 0, count: 0 };
    current.total += expense.amount;
    current.count += 1;
    map.set(expense.categoryId, current);
  }

  return Array.from(map.entries())
    .map(([categoryId, { total, count }]) => {
      const category = categories.find((c) => c.id === categoryId);
      return {
        categoryId,
        name: category?.name ?? "Sem categoria",
        color: category?.color ?? "#94a3b8",
        total,
        count,
        percentage: (total / totalAmount) * 100,
      };
    })
    .sort((a, b) => b.total - a.total);
}

export interface MonthlyTotal {
  monthKey: string;
  label: string;
  income: number;
  expenses: number;
  balance: number;
}

export function calculateMonthlyTotals(
  income: Income[],
  expenses: Expense[],
  monthsBack = 6
): MonthlyTotal[] {
  const now = new Date();
  const keys: string[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  const incomeByMonth = new Map<string, number>();
  for (const item of income) {
    const key = toMonthKey(item.date);
    incomeByMonth.set(key, (incomeByMonth.get(key) ?? 0) + item.amount);
  }

  const expensesByMonth = new Map<string, number>();
  for (const item of expenses) {
    const key = toMonthKey(item.date);
    expensesByMonth.set(key, (expensesByMonth.get(key) ?? 0) + item.amount);
  }

  let runningBalance = 0;
  // account for balance accumulated before the visible window
  const earliestVisible = keys[0];
  for (const [key, value] of incomeByMonth) {
    if (key < earliestVisible) runningBalance += value;
  }
  for (const [key, value] of expensesByMonth) {
    if (key < earliestVisible) runningBalance -= value;
  }

  return keys.map((key) => {
    const monthIncome = incomeByMonth.get(key) ?? 0;
    const monthExpenses = expensesByMonth.get(key) ?? 0;
    runningBalance += monthIncome - monthExpenses;
    return {
      monthKey: key,
      label: monthLabel(key),
      income: monthIncome,
      expenses: monthExpenses,
      balance: runningBalance,
    };
  });
}

export function averageTicket(expenses: Expense[]): number {
  if (expenses.length === 0) return 0;
  return sumAmounts(expenses) / expenses.length;
}

export function topCategory(totals: CategoryTotal[]): CategoryTotal | null {
  return totals[0] ?? null;
}

export function mostFrequentCategory(totals: CategoryTotal[]): CategoryTotal | null {
  if (totals.length === 0) return null;
  return [...totals].sort((a, b) => b.count - a.count)[0];
}

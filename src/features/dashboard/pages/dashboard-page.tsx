"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";
import { SummaryCards } from "@/features/dashboard/components/summary-cards";
import { ExpensesByCategoryChart } from "@/features/dashboard/components/expenses-by-category-chart";
import { IncomeVsExpensesChart } from "@/features/dashboard/components/income-vs-expenses-chart";
import { BalanceEvolutionChart } from "@/features/dashboard/components/balance-evolution-chart";
import { InsightsCard } from "@/features/dashboard/components/insights-card";
import { RecentLists } from "@/features/dashboard/components/recent-lists";

export function DashboardPage() {
  const {
    loading,
    totalIncome,
    totalExpenses,
    balance,
    entryCount,
    categoryTotals,
    monthlyTotals,
    recentExpenses,
    recentIncome,
    averageTicket,
    topCategory,
    mostFrequentCategory,
  } = useDashboard();

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-72 w-full" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <SummaryCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={balance}
          entryCount={entryCount}
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <ExpensesByCategoryChart data={categoryTotals} />
          <div className="lg:col-span-2">
            <IncomeVsExpensesChart data={monthlyTotals} />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <BalanceEvolutionChart data={monthlyTotals} />
          </div>
          <InsightsCard
            topCategory={topCategory}
            mostFrequentCategory={mostFrequentCategory}
            averageTicket={averageTicket}
          />
        </div>

        <RecentLists recentExpenses={recentExpenses} recentIncome={recentIncome} />
      </div>
    </AppShell>
  );
}

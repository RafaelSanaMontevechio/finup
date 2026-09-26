"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { ExpenseFiltersBar } from "@/features/expenses/components/expense-filters";
import { ExpenseTable } from "@/features/expenses/components/expense-table";
import { toMonthKey } from "@/lib/utils/format";

export function ExpensesListPage() {
  const { expenses, allExpenses, loading, filters, setFilters, update, remove } =
    useExpenses();
  const { categories } = useCategories();

  const months = Array.from(new Set(allExpenses.map((e) => toMonthKey(e.date)))).sort(
    (a, b) => (a < b ? 1 : -1)
  );

  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {allExpenses.length} gasto(s) registrado(s) no total.
        </p>
        <Button asChild>
          <Link href="/expenses/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo gasto
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <ExpenseFiltersBar
            filters={filters}
            onChange={setFilters}
            categories={categories}
            months={months}
          />

          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <ExpenseTable
              expenses={expenses}
              categories={categories}
              onUpdate={update}
              onDelete={remove}
            />
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}

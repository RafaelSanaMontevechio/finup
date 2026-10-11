"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { toMonthKey } from "@/lib/utils/format";

import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { ExpenseTable } from "@/features/expenses/components/expense-table";
import { ExpenseFiltersBar } from "@/features/expenses/components/expense-filters";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { ExpanseCardList } from "../components/expense-card-list";

export function ExpensesListPage() {
  const {
    expenses,
    allExpenses,
    loading,
    filters,
    setFilters,
    update,
    remove,
    totalPages,
    currentPage,
    handlePagination,
  } = useExpenses();
  const { categories } = useCategories();

  const months = Array.from(new Set(allExpenses.map((e) => toMonthKey(e.date)))).sort((a, b) =>
    a < b ? 1 : -1
  );

  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {allExpenses.length} gasto(s) registrado(s) no total.
        </p>
        <Button asChild size="sm">
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
            <>
              <div className="block md:hidden">
                <ExpanseCardList
                  expenses={expenses}
                  categories={categories}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPaginate={handlePagination}
                  onUpdate={update}
                  onDelete={remove}
                />
              </div>

              <div className="hidden md:block">
                <ExpenseTable
                  expenses={expenses}
                  categories={categories}
                  onUpdate={update}
                  onDelete={remove}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}

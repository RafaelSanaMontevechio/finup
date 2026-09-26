"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { ExpenseForm } from "@/features/expenses/components/expense-form";

export function ExpenseCreatePage() {
  const router = useRouter();
  const { create } = useExpenses();
  const { categories } = useCategories();

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <ExpenseForm
          categories={categories}
          onSubmit={create}
          onCancel={() => router.push("/expenses")}
        />
      </div>
    </AppShell>
  );
}

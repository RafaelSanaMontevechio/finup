"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIncome } from "@/features/income/hooks/use-income";
import { IncomeFiltersBar } from "@/features/income/components/income-filters";
import { IncomeTable } from "@/features/income/components/income-table";
import { IncomeFormDialog } from "@/features/income/components/income-form-dialog";
import { toMonthKey } from "@/lib/utils/format";
import type { Income } from "@/types";
import { toast } from "@/hooks/use-toast";

export function IncomeListPage() {
  const { income, allIncome, loading, filters, setFilters, create, update, remove } =
    useIncome();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Income | null>(null);

  const months = Array.from(new Set(allIncome.map((i) => toMonthKey(i.date)))).sort(
    (a, b) => (a < b ? 1 : -1)
  );

  function handleNew() {
    setEditing(null);
    setDialogOpen(true);
  }

  function handleEdit(item: Income) {
    setEditing(item);
    setDialogOpen(true);
  }

  async function handleSubmit(input: Parameters<typeof create>[0]) {
    const ok = editing ? await update(editing.id, input) : await create(input);
    toast(
      ok
        ? { title: editing ? "Entrada atualizada" : "Entrada criada" }
        : { variant: "destructive", title: "Erro ao salvar entrada" }
    );
    return ok;
  }

  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {allIncome.length} entrada(s) registrada(s) no total.
        </p>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nova entrada
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <IncomeFiltersBar filters={filters} onChange={setFilters} months={months} />

          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <IncomeTable income={income} onEdit={handleEdit} onDelete={remove} />
          )}
        </CardContent>
      </Card>

      <IncomeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        income={editing}
        onSubmit={handleSubmit}
      />
    </AppShell>
  );
}

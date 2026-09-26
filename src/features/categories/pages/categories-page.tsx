"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { CategoryTable } from "@/features/categories/components/category-table";
import { CategoryFormDialog } from "@/features/categories/components/category-form-dialog";
import type { Category } from "@/types";
import { toast } from "@/hooks/use-toast";

export function CategoriesPage() {
  const { categories, loading, create, update, remove } = useCategories();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  function handleNew() {
    setEditing(null);
    setDialogOpen(true);
  }

  function handleEdit(category: Category) {
    setEditing(category);
    setDialogOpen(true);
  }

  async function handleSubmit(input: Parameters<typeof create>[0]) {
    const ok = editing ? await update(editing.id, input) : await create(input);
    if (ok) {
      toast({ title: editing ? "Categoria atualizada" : "Categoria criada" });
    } else {
      toast({ variant: "destructive", title: "Erro ao salvar categoria" });
    }
    return ok;
  }

  async function handleDelete(id: string) {
    const ok = await remove(id);
    toast(
      ok
        ? { title: "Categoria excluída" }
        : { variant: "destructive", title: "Erro ao excluir categoria" }
    );
    return ok;
  }

  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Gerencie as categorias usadas nos seus gastos.
        </p>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nova categoria
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <CategoryTable
              categories={categories}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editing}
        onSubmit={handleSubmit}
      />
    </AppShell>
  );
}

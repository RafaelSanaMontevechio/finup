"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Category, Expense } from "@/types";
import { PAYMENT_METHOD_LABELS } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { categoryColor, categoryName } from "@/features/expenses/utils/category-color";
import { ExpenseForm } from "@/features/expenses/components/expense-form";
import type { ExpenseInput } from "@/lib/validations/schemas";
import { toast } from "@/hooks/use-toast";

const PAGE_SIZE = 10;

interface ExpenseTableProps {
  expenses: Expense[];
  categories: Category[];
  onUpdate: (id: string, input: ExpenseInput) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onDeleteInstallmentsFrom: (groupId: string, from: number) => Promise<boolean>;
}

export function ExpenseTable({
  expenses,
  categories,
  onUpdate,
  onDelete,
  onDeleteInstallmentsFrom,
}: ExpenseTableProps) {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Expense | null>(null);

  const totalPages = Math.max(1, Math.ceil(expenses.length / PAGE_SIZE));
  const paged = expenses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleUpdate(input: ExpenseInput) {
    if (!editing) return false;
    const ok = await onUpdate(editing.id, input);
    if (ok) {
      toast({ title: "Gasto atualizado" });
      setEditing(null);
    } else {
      toast({ variant: "destructive", title: "Erro ao atualizar gasto" });
    }
    return ok;
  }

  const isInstallment =
    !!pendingDelete?.installmentGroupId && (pendingDelete.installmentTotal ?? 1) > 1;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Nenhum gasto encontrado.
              </TableCell>
            </TableRow>
          )}
          {paged.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{formatDate(expense.date)}</TableCell>
              <TableCell className="max-w-[220px] truncate">
                <span>{expense.description}</span>
                {expense.installmentTotal && expense.installmentTotal > 1 && (
                  <Badge variant="secondary" className="ml-2 align-middle">
                    {expense.installmentNumber}/{expense.installmentTotal}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: categoryColor(categories, expense.categoryId),
                    color: categoryColor(categories, expense.categoryId),
                  }}
                >
                  {categoryName(categories, expense.categoryId)}
                </Badge>
              </TableCell>
              <TableCell>{PAYMENT_METHOD_LABELS[expense.paymentMethod]}</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(expense.amount)}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => setEditing(expense)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setPendingDelete(expense)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar gasto</DialogTitle>
          </DialogHeader>
          {editing && (
            <ExpenseForm
              categories={categories}
              expense={editing}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir gasto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O lançamento "{pendingDelete?.description}"
              {isInstallment
                ? ` (parcela ${pendingDelete?.installmentNumber}/${pendingDelete?.installmentTotal})`
                : ""}{" "}
              será removido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            {isInstallment && (
              <Button
                variant="outline"
                onClick={async () => {
                  if (pendingDelete?.installmentGroupId && pendingDelete.installmentNumber) {
                    const ok = await onDeleteInstallmentsFrom(
                      pendingDelete.installmentGroupId,
                      pendingDelete.installmentNumber
                    );
                    toast(
                      ok
                        ? { title: "Parcelas futuras excluídas" }
                        : { variant: "destructive", title: "Erro ao excluir parcelas" }
                    );
                  }
                  setPendingDelete(null);
                }}
              >
                Excluir esta e as futuras
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={async () => {
                if (pendingDelete) {
                  const ok = await onDelete(pendingDelete.id);
                  toast(
                    ok
                      ? { title: "Gasto excluído" }
                      : { variant: "destructive", title: "Erro ao excluir gasto" }
                  );
                }
                setPendingDelete(null);
              }}
            >
              {isInstallment ? "Excluir apenas esta" : "Excluir"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

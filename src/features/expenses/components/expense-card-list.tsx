import { Category, Expense, PAYMENT_METHOD_LABELS } from "@/types";
import { ExpenseInput } from "@/lib/validations/schemas";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { categoryColor, categoryName } from "../utils/category-color";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

interface ExpenseCardProps {
  expense: Expense;
  categories: Category[];
  onUpdate: (id: string, input: ExpenseInput) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export function ExpenseCard({ expense, categories, onUpdate, onDelete }: ExpenseCardProps) {
  const [busy, setBusy] = useState(false);
  const color = categoryColor(categories, expense.categoryId);
  const name = categoryName(categories, expense.categoryId);

  async function handleDelete() {
    if (!confirm("Excluir esta despesa?")) return;
    setBusy(true);
    try {
      await onDelete(expense.id);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-3 p-4 pb-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-medium" style={{ borderColor: color, color }}>
              <span
                className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              {name}
            </Badge>
            <p className="text-xs text-muted-foreground">{formatDate(expense.date)}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              disabled={busy}
              aria-label="Ações"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onUpdate(expense.id, expense)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-3 p-4 pt-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="mt-0.5 truncate text-sm font-semibold text-foreground">
            {expense.description}
          </h3>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col border-t bg-muted/30 px-4 py-3">
        <div className="w-full flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Forma de pagamento
          </span>
          <span className="text-xs text-muted-foreground">
            {PAYMENT_METHOD_LABELS[expense.paymentMethod]}
          </span>
        </div>
        <div className="w-full flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Valor</span>
          <span className="text-base font-semibold tabular-nums text-foreground">
            {formatCurrency(expense.amount)}
          </span>
        </div>
        {/* <span className="text-xs uppercase tracking-wide text-muted-foreground">Valor</span>
        <span className="text-base font-semibold tabular-nums text-foreground">
          {formatCurrency(expense.amount)}
        </span> */}
      </CardFooter>
    </Card>
  );
}

interface ExpanseCardListProps {
  expenses: Expense[];
  categories: Category[];
  currentPage: number;
  totalPages: number;
  onPaginate: (page: number) => void;
  onUpdate: (id: string, input: ExpenseInput) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export function ExpanseCardList({
  expenses,
  categories,
  currentPage,
  totalPages,
  onPaginate,
  onUpdate,
  onDelete,
}: ExpanseCardListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          categories={categories}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPaginate(currentPage - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPaginate(currentPage + 1)}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { expenseSchema, type ExpenseInput } from "@/lib/validations/schemas";
import { PAYMENT_METHOD_LABELS, type Expense, type Category } from "@/types";
import { formatCurrency } from "@/lib/utils/format";
import { toast } from "@/hooks/use-toast";

interface ExpenseFormProps {
  categories: Category[];
  expense?: Expense | null;
  onSubmit: (input: ExpenseInput) => Promise<boolean>;
  onCancel?: () => void;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function ExpenseForm({ categories, expense, onSubmit, onCancel }: ExpenseFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseInput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense
      ? {
          date: expense.date,
          description: expense.description,
          categoryId: expense.categoryId,
          paymentMethod: expense.paymentMethod,
          amount: expense.amount,
          notes: expense.notes ?? "",
          installments: 1,
        }
      : {
          date: todayISO(),
          description: "",
          categoryId: categories[0]?.id ?? "",
          paymentMethod: "pix",
          amount: 0,
          notes: "",
          installments: 1,
        },
  });

  const paymentMethod = watch("paymentMethod");
  const installments = watch("installments");
  const amount = watch("amount");
  const isNewCreditPurchase = !expense && paymentMethod === "credito";

  async function handleFormSubmit(values: ExpenseInput) {
    const ok = await onSubmit(values);

    if (ok) {
      toast({
        title: expense
          ? "Gasto atualizado"
          : values.installments > 1
            ? `Compra parcelada em ${values.installments}x criada`
            : "Gasto criado com sucesso",
      });
      if (!expense) router.push("/expenses");
    } else {
      toast({ variant: "destructive", title: "Erro ao salvar gasto" });
    }
  }

  useEffect(() => {
    if (expense) {
      reset({
        date: expense.date,
        description: expense.description,
        categoryId: expense.categoryId,
        paymentMethod: expense.paymentMethod,
        amount: expense.amount,
        notes: expense.notes ?? "",
        installments: 1,
      });
    }
  }, [expense, reset]);

  return (
    <Card>
      <CardContent className="pt-6">
        {expense?.installmentTotal && expense.installmentTotal > 1 && (
          <p className="mb-4 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            Parcela {expense.installmentNumber} de {expense.installmentTotal} — editar aqui altera
            só esta parcela.
          </p>
        )}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <Input id="amount" type="number" step="0.01" min="0" {...register("amount")} />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Supermercado do mês"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="text-xs text-destructive">{errors.categoryId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Forma de pagamento</Label>
              <Controller
                control={control}
                name="paymentMethod"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {isNewCreditPurchase && (
            <div className="space-y-2 rounded-md border border-dashed p-3">
              <Label htmlFor="installments">Parcelas</Label>
              <Input
                id="installments"
                type="number"
                min="1"
                max="48"
                {...register("installments")}
              />
              {errors.installments && (
                <p className="text-xs text-destructive">{errors.installments.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {installments > 1
                  ? `"Valor" acima é o total da compra. Serão criadas ${installments} parcelas de ${
                      amount > 0 ? formatCurrency(amount / installments) : "—"
                    } cada, uma por mês a partir da data informada.`
                  : "Se for parcelado, aumente este número — o valor total será dividido automaticamente."}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Input id="notes" placeholder="Detalhes adicionais" {...register("notes")} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar gasto"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

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
        }
      : {
          date: todayISO(),
          description: "",
          categoryId: categories[0]?.id ?? "",
          paymentMethod: "pix",
          amount: 0,
          notes: "",
        },
  });

  useEffect(() => {
    if (expense) {
      reset({
        date: expense.date,
        description: expense.description,
        categoryId: expense.categoryId,
        paymentMethod: expense.paymentMethod,
        amount: expense.amount,
        notes: expense.notes ?? "",
      });
    }
  }, [expense, reset]);

  async function handleFormSubmit(values: ExpenseInput) {
    const ok = await onSubmit(values);
    if (ok) {
      toast({ title: expense ? "Gasto atualizado" : "Gasto criado com sucesso" });
      if (!expense) router.push("/expenses");
    } else {
      toast({ variant: "destructive", title: "Erro ao salvar gasto" });
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
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
            <Input id="description" placeholder="Ex: Supermercado do mês" {...register("description")} />
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

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { incomeSchema, type IncomeInput } from "@/lib/validations/schemas";
import type { Income } from "@/types";

interface IncomeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  income?: Income | null;
  onSubmit: (input: IncomeInput) => Promise<boolean>;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function IncomeFormDialog({ open, onOpenChange, income, onSubmit }: IncomeFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IncomeInput>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      date: todayISO(),
      source: "",
      description: "",
      amount: 0,
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        income
          ? {
              date: income.date,
              source: income.source,
              description: income.description,
              amount: income.amount,
              notes: income.notes ?? "",
            }
          : { date: todayISO(), source: "", description: "", amount: 0, notes: "" }
      );
    }
  }, [open, income, reset]);

  async function handleFormSubmit(values: IncomeInput) {
    const ok = await onSubmit(values);
    if (ok) onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{income ? "Editar entrada" : "Nova entrada"}</DialogTitle>
        </DialogHeader>
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
              {errors.amount && (
                <p className="text-xs text-destructive">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Fonte</Label>
            <Input id="source" placeholder="Ex: Salário, Freelance..." {...register("source")} />
            {errors.source && <p className="text-xs text-destructive">{errors.source.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" placeholder="Ex: Pagamento mensal" {...register("description")} />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Input id="notes" {...register("notes")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

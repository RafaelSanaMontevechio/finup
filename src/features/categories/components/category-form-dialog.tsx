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
import { categorySchema, type CategoryInput } from "@/lib/validations/schemas";
import type { Category } from "@/types";
import {
  CATEGORY_COLORS,
  CATEGORY_ICON_NAMES,
  getCategoryIcon,
} from "@/features/categories/utils/icon-map";
import { cn } from "@/lib/utils/cn";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onSubmit: (input: CategoryInput) => Promise<boolean>;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
}: CategoryFormDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      color: CATEGORY_COLORS[0],
      icon: CATEGORY_ICON_NAMES[0],
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        category
          ? { name: category.name, color: category.color, icon: category.icon }
          : { name: "", color: CATEGORY_COLORS[0], icon: CATEGORY_ICON_NAMES[0] }
      );
    }
  }, [open, category, reset]);

  const color = watch("color");
  const icon = watch("icon");

  async function handleFormSubmit(values: CategoryInput) {
    const ok = await onSubmit(values);
    if (ok) onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Editar categoria" : "Nova categoria"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" placeholder="Ex: Alimentação" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setValue("color", c, { shouldValidate: true })}
                  className={cn(
                    "h-7 w-7 rounded-full border-2",
                    color === c ? "border-foreground" : "border-transparent"
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`Cor ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ícone</Label>
            <div className="grid grid-cols-6 gap-2">
              {CATEGORY_ICON_NAMES.map((name) => {
                const Icon = getCategoryIcon(name);
                return (
                  <button
                    type="button"
                    key={name}
                    onClick={() => setValue("icon", name, { shouldValidate: true })}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-md border",
                      icon === name ? "border-primary bg-accent" : "border-input"
                    )}
                    aria-label={name}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
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

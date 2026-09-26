"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/types";
import type { ExpenseFilters } from "@/features/expenses/hooks/use-expenses";

interface ExpenseFiltersBarProps {
  filters: ExpenseFilters;
  onChange: (filters: ExpenseFilters) => void;
  categories: Category[];
  months: string[];
}

export function ExpenseFiltersBar({
  filters,
  onChange,
  categories,
  months,
}: ExpenseFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar por descrição ou observação..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>

      <Select
        value={filters.categoryId}
        onValueChange={(value) => onChange({ ...filters, categoryId: value })}
      >
        <SelectTrigger className="sm:w-48">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.month}
        onValueChange={(value) => onChange({ ...filters, month: value })}
      >
        <SelectTrigger className="sm:w-40">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todo o período</SelectItem>
          {months.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.sortBy}
        onValueChange={(value) =>
          onChange({ ...filters, sortBy: value as ExpenseFilters["sortBy"] })
        }
      >
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Ordenar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date-desc">Data (mais recente)</SelectItem>
          <SelectItem value="date-asc">Data (mais antiga)</SelectItem>
          <SelectItem value="amount-desc">Valor (maior)</SelectItem>
          <SelectItem value="amount-asc">Valor (menor)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

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
import type { IncomeFilters } from "@/features/income/hooks/use-income";

interface IncomeFiltersBarProps {
  filters: IncomeFilters;
  onChange: (filters: IncomeFilters) => void;
  months: string[];
}

export function IncomeFiltersBar({ filters, onChange, months }: IncomeFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar por fonte ou descrição..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>

      <Select value={filters.month} onValueChange={(value) => onChange({ ...filters, month: value })}>
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
          onChange({ ...filters, sortBy: value as IncomeFilters["sortBy"] })
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

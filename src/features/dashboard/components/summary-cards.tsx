import { ArrowDownCircle, ArrowUpCircle, Scale, ListChecks } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  entryCount: number;
}

export function SummaryCards({ totalIncome, totalExpenses, balance, entryCount }: SummaryCardsProps) {
  const items = [
    {
      label: "Total de Entradas",
      value: formatCurrency(totalIncome),
      icon: ArrowUpCircle,
      tone: "text-green-600 dark:text-green-400",
    },
    {
      label: "Total de Gastos",
      value: formatCurrency(totalExpenses),
      icon: ArrowDownCircle,
      tone: "text-red-500",
    },
    {
      label: "Saldo Atual",
      value: formatCurrency(balance),
      icon: Scale,
      tone: balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500",
    },
    {
      label: "Lançamentos",
      value: String(entryCount),
      icon: ListChecks,
      tone: "text-muted-foreground",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="flex items-center justify-between pt-6">
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className={cn("text-xl font-semibold", item.tone)}>{item.value}</p>
            </div>
            <item.icon className={cn("h-8 w-8 opacity-70", item.tone)} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

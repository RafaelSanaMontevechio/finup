import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Expense, Income } from "@/types";

interface RecentListsProps {
  recentExpenses: Expense[];
  recentIncome: Income[];
}

export function RecentLists({ recentExpenses, recentIncome }: RecentListsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Últimos 5 gastos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentExpenses.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum gasto registrado.</p>
          )}
          {recentExpenses.map((e) => (
            <div key={e.id} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{e.description}</p>
                <p className="text-xs text-muted-foreground">{formatDate(e.date)}</p>
              </div>
              <span className="font-medium text-red-500">{formatCurrency(e.amount)}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Últimas 5 entradas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentIncome.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhuma entrada registrada.</p>
          )}
          {recentIncome.map((i) => (
            <div key={i.id} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{i.description}</p>
                <p className="text-xs text-muted-foreground">
                  {i.source} · {formatDate(i.date)}
                </p>
              </div>
              <span className="font-medium text-green-600 dark:text-green-400">
                {formatCurrency(i.amount)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

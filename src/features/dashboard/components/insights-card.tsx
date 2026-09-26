import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";
import type { CategoryTotal } from "@/features/dashboard/utils/calculations";

interface InsightsCardProps {
  topCategory: CategoryTotal | null;
  mostFrequentCategory: CategoryTotal | null;
  averageTicket: number;
}

export function InsightsCard({ topCategory, mostFrequentCategory, averageTicket }: InsightsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Maior categoria de gasto</span>
          <span className="font-medium">
            {topCategory ? `${topCategory.name} (${formatCurrency(topCategory.total)})` : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Categoria com mais lançamentos</span>
          <span className="font-medium">
            {mostFrequentCategory
              ? `${mostFrequentCategory.name} (${mostFrequentCategory.count})`
              : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Ticket médio de gasto</span>
          <span className="font-medium">{formatCurrency(averageTicket)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

import type { CategoryTotal } from "@/features/dashboard/utils/calculations";

import { formatCurrency } from "@/lib/utils/format";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ExpensesByCategoryChart({ data }: { data: CategoryTotal[] }) {
  return (
    <Card>
      <CardHeader className="p-3 md:p-4">
        <CardTitle>Gastos por categoria</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Nenhum gasto registrado ainda.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.categoryId} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

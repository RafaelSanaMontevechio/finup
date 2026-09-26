import type { Category } from "@/types";

export function categoryColor(categories: Category[], categoryId: string): string {
  return categories.find((c) => c.id === categoryId)?.color ?? "#94a3b8";
}

export function categoryName(categories: Category[], categoryId: string): string {
  return categories.find((c) => c.id === categoryId)?.name ?? "Sem categoria";
}

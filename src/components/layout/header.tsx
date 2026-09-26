"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAuthStore } from "@/stores/auth.store";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/expenses": "Gastos",
  "/expenses/new": "Novo Gasto",
  "/income": "Entradas",
  "/categories": "Categorias",
};

export function Header() {
  const pathname = usePathname() || "/dashboard";
  const user = useAuthStore((s) => s.user);
  const title = PAGE_TITLES[pathname] ?? "Controle Financeiro";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div>
        <p className="text-xs text-muted-foreground">Início / {title}</p>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Olá, {user.name}
          </span>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Controle Financeiro",
  description: "Gerencie suas entradas e gastos em um só lugar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

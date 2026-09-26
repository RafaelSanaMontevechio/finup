export type PaymentMethod =
  | "dinheiro"
  | "pix"
  | "debito"
  | "credito"
  | "boleto"
  | "outro";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  dinheiro: "Dinheiro",
  pix: "Pix",
  debito: "Cartão de Débito",
  credito: "Cartão de Crédito",
  boleto: "Boleto",
  outro: "Outro",
};

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  color: string; // hex color, e.g. "#22c55e"
  icon: string; // lucide-react icon name, e.g. "ShoppingCart"
  type: "despesa";
}

export interface Expense {
  id: string;
  date: string; // ISO date, "2025-01-15"
  description: string;
  categoryId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  notes?: string;
}

export interface Income {
  id: string;
  date: string; // ISO date
  source: string;
  description: string;
  amount: number;
  notes?: string;
}

export interface ApiListResponse<T> {
  data: T[];
}

export interface ApiItemResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error: string;
}

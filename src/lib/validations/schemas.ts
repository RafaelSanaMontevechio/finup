import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const paymentMethodEnum = z.enum([
  "dinheiro",
  "pix",
  "debito",
  "credito",
  "boleto",
  "outro",
]);

export const expenseSchema = z.object({
  date: z.string().min(1, "Informe a data"),
  description: z.string().min(2, "Descrição muito curta"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  paymentMethod: paymentMethodEnum,
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  notes: z.string().optional(),
});
export type ExpenseInput = z.infer<typeof expenseSchema>;

export const incomeSchema = z.object({
  date: z.string().min(1, "Informe a data"),
  source: z.string().min(2, "Informe a fonte"),
  description: z.string().min(2, "Descrição muito curta"),
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  notes: z.string().optional(),
});
export type IncomeInput = z.infer<typeof incomeSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  color: z.string().min(1, "Escolha uma cor"),
  icon: z.string().min(1, "Escolha um ícone"),
});
export type CategoryInput = z.infer<typeof categorySchema>;

import { NextRequest, NextResponse } from "next/server";
import { expenseSchema } from "@/lib/validations/schemas";
import { expensesService } from "@/features/expenses/services/expenses.service";
import { requireUser } from "@/lib/api/require-user";
import { withApiErrorHandling } from "@/lib/api/with-error-handling";

export async function GET() {
  return withApiErrorHandling(async () => {
    const auth = await requireUser();
    if ("response" in auth) return auth.response;

    const data = await expensesService.list(auth.user.uid);
    return NextResponse.json({ data });
  });
}

export async function POST(request: NextRequest) {
  return withApiErrorHandling(async () => {
    const auth = await requireUser();
    if ("response" in auth) return auth.response;

    const body = await request.json();
    const parsed = expenseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }
    const data = await expensesService.create(auth.user.uid, parsed.data);
    return NextResponse.json({ data }, { status: 201 });
  });
}

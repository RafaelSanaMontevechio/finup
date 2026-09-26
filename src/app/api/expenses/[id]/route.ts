import { NextRequest, NextResponse } from "next/server";
import { expenseSchema } from "@/lib/validations/schemas";
import { expensesService } from "@/features/expenses/services/expenses.service";
import { requireUser } from "@/lib/api/require-user";
import { withApiErrorHandling } from "@/lib/api/with-error-handling";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withApiErrorHandling(async () => {
    const auth = await requireUser();
    if ("response" in auth) return auth.response;

    const { id } = await params;
    const body = await request.json();
    const parsed = expenseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }
    const data = await expensesService.update(auth.user.uid, id, parsed.data);
    if (!data) {
      return NextResponse.json({ error: "Gasto não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ data });
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withApiErrorHandling(async () => {
    const auth = await requireUser();
    if ("response" in auth) return auth.response;

    const { id } = await params;
    const ok = await expensesService.remove(auth.user.uid, id);
    if (!ok) {
      return NextResponse.json({ error: "Gasto não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ data: { id } });
  });
}

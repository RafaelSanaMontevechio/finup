import { NextRequest, NextResponse } from "next/server";
import { incomeSchema } from "@/lib/validations/schemas";
import { incomeService } from "@/features/income/services/income.service";
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
    const parsed = incomeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }
    const data = await incomeService.update(auth.user.uid, id, parsed.data);
    if (!data) {
      return NextResponse.json({ error: "Entrada não encontrada" }, { status: 404 });
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
    const ok = await incomeService.remove(auth.user.uid, id);
    if (!ok) {
      return NextResponse.json({ error: "Entrada não encontrada" }, { status: 404 });
    }
    return NextResponse.json({ data: { id } });
  });
}

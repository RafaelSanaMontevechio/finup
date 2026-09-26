import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/schemas";
import { signInWithEmailPassword } from "@/lib/firebase/auth-rest";
import { createSession } from "@/lib/firebase/session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  try {
    const result = await signInWithEmailPassword(parsed.data.email, parsed.data.password);
    await createSession(result.idToken);

    return NextResponse.json({
      data: {
        user: {
          id: result.localId,
          email: result.email,
          name: result.displayName || result.email,
        },
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Não foi possível entrar";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

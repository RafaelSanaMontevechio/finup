import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/firebase/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  return NextResponse.json({
    data: { user: { id: user.uid, email: user.email, name: user.name } },
  });
}

import { NextResponse } from "next/server";
import { getSessionUser, type SessionUser } from "@/lib/firebase/session";

export async function requireUser(): Promise<
  { user: SessionUser } | { response: NextResponse }
> {
  const user = await getSessionUser();
  if (!user) {
    return {
      response: NextResponse.json({ error: "Não autenticado" }, { status: 401 }),
    };
  }
  return { user };
}

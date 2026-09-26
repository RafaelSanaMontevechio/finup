import { NextResponse } from "next/server";
import { clearSession } from "@/lib/firebase/session";

export async function POST() {
  await clearSession();
  return NextResponse.json({ data: { ok: true } });
}

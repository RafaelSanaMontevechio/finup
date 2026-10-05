import { NextResponse } from "next/server";

/**
 * Envolve o corpo de uma Route Handler para garantir que qualquer exceção
 * (ex: credenciais do Firebase erradas, Firestore não provisionado, erro de
 * rede) sempre vire uma resposta JSON válida em vez de deixar o Next.js
 * fechar a conexão sem corpo (o que faz `res.json()` no cliente quebrar com
 * "Unexpected end of JSON input", escondendo o erro real).
 *
 * O erro completo é logado no terminal do servidor com console.error — é lá
 * que fica a causa raiz (ex: "Failed to parse private key", "5 NOT_FOUND",
 * etc).
 */
export async function withApiErrorHandling(
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    return await handler();
  } catch (err) {
    console.error("[api] erro não tratado:", err);
    const message = err instanceof Error ? err.message : "Erro interno inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * O Admin SDK não sabe validar senha de usuário (isso é exclusivo do SDK
 * cliente ou da API REST do Identity Toolkit). Como a decisão foi manter
 * tudo no servidor (sem SDK do Firebase no navegador), a Route Handler de
 * login chama esta função, que usa a API REST pública do Identity Toolkit
 * com a Web API Key do projeto (não é uma credencial secreta — é a mesma
 * chave usada por qualquer app cliente do Firebase).
 */

interface SignInResult {
  idToken: string;
  localId: string;
  email: string;
  displayName?: string;
}

interface SignInErrorBody {
  error?: { message?: string };
}

export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<SignInResult> {
  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  if (!apiKey) {
    throw new Error("FIREBASE_WEB_API_KEY não configurada");
  }

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );

  const body = await res.json();

  if (!res.ok) {
    const errBody = body as SignInErrorBody;
    const code = errBody.error?.message ?? "SIGN_IN_FAILED";
    if (
      code === "EMAIL_NOT_FOUND" ||
      code === "INVALID_PASSWORD" ||
      code === "INVALID_LOGIN_CREDENTIALS"
    ) {
      throw new Error("E-mail ou senha inválidos");
    }
    throw new Error("Não foi possível entrar no momento");
  }

  return {
    idToken: body.idToken,
    localId: body.localId,
    email: body.email,
    displayName: body.displayName,
  };
}

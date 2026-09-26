async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });

  // Lê como texto primeiro: uma rota que quebrou sem tratamento pode devolver
  // corpo vazio ou HTML, e `res.json()` direto joga um erro genérico demais
  // ("Unexpected end of JSON input") que esconde a causa real.
  const raw = await res.text();
  let json: { data?: T; error?: string } = {};
  if (raw) {
    try {
      json = JSON.parse(raw);
    } catch {
      throw new Error(
        `Resposta inválida do servidor (status ${res.status}). Veja o terminal do "next dev" para o erro real.`
      );
    }
  }

  if (!res.ok) {
    throw new Error(
      json.error ||
        `Erro inesperado (status ${res.status}${!raw ? ", resposta vazia" : ""})`
    );
  }

  return json.data as T;
}

export const apiClient = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};

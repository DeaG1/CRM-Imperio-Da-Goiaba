/** Cliente HTTP da interface para a API em /api. */
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function api<T = any>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Sem conexão com o servidor. Verifique a internet e tente de novo.');
  }
  let data: { erro?: string } | null = null;
  try {
    data = await res.json();
  } catch {
    /* resposta sem corpo */
  }
  if (!res.ok) throw new ApiError(res.status, data?.erro || `Erro ${res.status}`);
  return data as T;
}

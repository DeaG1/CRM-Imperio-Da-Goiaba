import { unstable_rethrow } from 'next/navigation';
import { ZodError } from 'zod';

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const badRequest = (m: string) => new HttpError(400, m);
export const unauthorized = (m = 'Faça login para continuar.') => new HttpError(401, m);
export const forbidden = (m = 'Seu perfil não tem permissão para isso.') => new HttpError(403, m);
export const notFound = (m = 'Registro não encontrado.') => new HttpError(404, m);

function zodMessage(e: ZodError): string {
  const i = e.issues[0];
  if (!i) return 'Dados inválidos.';
  // mensagens próprias (definidas nos schemas) já vêm em português
  if (i.message && !/^(Invalid|Expected|Too|Unrecognized)/.test(i.message)) return i.message;
  return `Campo inválido: ${i.path.join('.') || 'corpo'}.`;
}

type Handler<C> = (req: Request, ctx: C) => Promise<Response>;

/**
 * Envolve um Route Handler: exige JSON nas mutações (proteção simples contra
 * CSRF de formulário) e converte erros em `{ erro }` com o status certo.
 */
export function handle<C>(fn: Handler<C>): Handler<C> {
  return async (req, ctx) => {
    try {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        const ct = req.headers.get('content-type') || '';
        if (!ct.includes('application/json')) throw new HttpError(415, 'Envie os dados como JSON.');
      }
      return await fn(req, ctx);
    } catch (e) {
      unstable_rethrow(e); // erros internos do Next (ex.: fim do prerender) seguem adiante
      if (e instanceof HttpError) return Response.json({ erro: e.message }, { status: e.status });
      if (e instanceof ZodError) return Response.json({ erro: zodMessage(e) }, { status: 400 });
      const code = (e as { code?: string; cause?: { code?: string } })?.code ??
        (e as { cause?: { code?: string } })?.cause?.code;
      if (code === '23503' || code === '23001') {
        return Response.json({ erro: 'Este registro está ligado a outro (vínculo inválido ou em uso).' }, { status: 409 });
      }
      if (code === '23505') return Response.json({ erro: 'Já existe um registro com esses dados.' }, { status: 409 });
      console.error('[api]', e);
      return Response.json({ erro: 'Erro interno. Tente de novo.' }, { status: 500 });
    }
  };
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throw badRequest('JSON inválido.');
  }
}

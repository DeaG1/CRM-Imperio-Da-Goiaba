import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { getDb } from '@/server/db';
import { loginFalhas, users } from '@/server/db/schema';
import { handle, HttpError, readJson } from '@/server/http';
import { verifyPassword } from '@/server/password';
import { createSession } from '@/server/session';

// bloqueio por usuário: 5 erros seguidos em 15 min → espera. Fica no banco para valer
// em todas as instâncias do servidor (na Cloudflare cada requisição pode cair numa diferente).
const JANELA_MS = 15 * 60_000;
const MAX_FALHAS = 5;
// hash qualquer: comparar mesmo sem usuário, para o tempo de resposta não revelar quem existe
const HASH_FICTICIO = `scrypt$${'0'.repeat(32)}$${'0'.repeat(128)}`;

const corpo = z.object({
  usuario: z.string().trim().toLowerCase().min(1, 'Informe o usuário.').max(60),
  senha: z.string().min(1, 'Informe a senha.').max(200),
});

export const POST = handle(async (req: Request) => {
  const { usuario, senha } = corpo.parse(await readJson(req));
  const db = await getDb();
  const agora = Date.now();
  const [f] = await db.select().from(loginFalhas).where(eq(loginFalhas.usuario, usuario)).limit(1);
  const dentroDaJanela = !!f && agora - new Date(f.desde).getTime() < JANELA_MS;
  if (f && dentroDaJanela && f.falhas >= MAX_FALHAS) {
    throw new HttpError(429, 'Muitas tentativas. Aguarde alguns minutos e tente de novo.');
  }
  const [u] = await db.select().from(users).where(eq(users.usuario, usuario)).limit(1);
  const ok = await verifyPassword(senha, u?.senhaHash ?? HASH_FICTICIO);
  if (!u || !ok || !u.ativo) {
    // janela nova (ou vencida) recomeça a contagem; senão soma
    await db.insert(loginFalhas).values({ usuario, falhas: 1, desde: new Date(agora) })
      .onConflictDoUpdate({
        target: loginFalhas.usuario,
        set: dentroDaJanela
          ? { falhas: sql`${loginFalhas.falhas} + 1` }
          : { falhas: 1, desde: new Date(agora) },
      });
    throw new HttpError(401, 'Usuário ou senha incorretos.');
  }
  if (f) await db.delete(loginFalhas).where(eq(loginFalhas.usuario, usuario));
  await createSession(u.id);
  return Response.json({ user: { id: u.id, nome: u.nome, usuario: u.usuario, role: u.role } });
});

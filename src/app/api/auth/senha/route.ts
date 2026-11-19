import { and, eq, ne } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { createHash } from 'node:crypto';
import { getDb } from '@/server/db';
import { sessions, users } from '@/server/db/schema';
import { handle, HttpError, readJson } from '@/server/http';
import { hashPassword, verifyPassword } from '@/server/password';
import { requireUser, SESSION_COOKIE } from '@/server/session';
import { trocaSenha } from '@/server/usuarios';

/** "Minha senha": confere a atual, grava a nova e encerra as outras sessões. */
export const POST = handle(async (req: Request) => {
  const quem = await requireUser();
  const d = trocaSenha.parse(await readJson(req));
  const db = await getDb();
  const [u] = await db.select().from(users).where(eq(users.id, quem.id)).limit(1);
  if (!u || !(await verifyPassword(d.atual, u.senhaHash))) throw new HttpError(400, 'A senha atual não confere.');
  if (d.atual === d.nova) throw new HttpError(400, 'A nova senha precisa ser diferente da atual.');
  await db.update(users).set({ senhaHash: await hashPassword(d.nova) }).where(eq(users.id, quem.id));
  const token = (await cookies()).get(SESSION_COOKIE)?.value || '';
  const atual = createHash('sha256').update(token).digest('hex');
  await db.delete(sessions).where(and(eq(sessions.userId, quem.id), ne(sessions.id, atual)));
  return Response.json({ ok: true });
});

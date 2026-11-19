/**
 * Sessões: token aleatório no cookie httpOnly; no banco fica só o SHA-256.
 */
import { createHash, randomBytes } from 'node:crypto';
import { and, eq, gt, lt } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { getDb } from './db';
import { sessions, users } from './db/schema';
import { forbidden, unauthorized } from './http';

export const SESSION_COOKIE = 'crm_session';
const TTL_DIAS = 30;

export type Role = 'admin' | 'colaborador';
export type SessionUser = { id: number; nome: string; usuario: string; role: Role };

const sha256 = (t: string) => createHash('sha256').update(t).digest('hex');

export async function createSession(userId: number) {
  const db = await getDb();
  const token = randomBytes(32).toString('base64url');
  const expiraEm = new Date(Date.now() + TTL_DIAS * 86_400_000);
  await db.insert(sessions).values({ id: sha256(token), userId, expiraEm });
  // limpeza oportunista de sessões vencidas
  await db.delete(sessions).where(lt(sessions.expiraEm, new Date()));
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiraEm,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    const db = await getDb();
    await db.delete(sessions).where(eq(sessions.id, sha256(token)));
  }
  jar.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const db = await getDb();
  const [row] = await db
    .select({ id: users.id, nome: users.nome, usuario: users.usuario, role: users.role })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, sha256(token)), gt(sessions.expiraEm, new Date()), eq(users.ativo, true)))
    .limit(1);
  return row ?? null;
}

export async function requireUser(roles?: readonly Role[]): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw unauthorized();
  if (roles && !roles.includes(user.role)) throw forbidden();
  return user;
}

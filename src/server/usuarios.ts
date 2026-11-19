/** Regras de usuários (cadastro pela tela de Configurações). */
import { and, eq, ne } from 'drizzle-orm';
import { z } from 'zod';
import type { Db } from './db';
import { sessions, users } from './db/schema';
import { HttpError } from './http';

export const publico = (u: typeof users.$inferSelect) => ({
  id: u.id, nome: u.nome, usuario: u.usuario, role: u.role, ativo: u.ativo,
  criadoEm: u.criadoEm instanceof Date ? u.criadoEm.toISOString() : u.criadoEm,
});

const nome = z.string().trim().min(1, 'Informe o nome.').max(120);
const usuario = z.string().trim().toLowerCase()
  .regex(/^[a-z0-9._-]{3,40}$/, 'Usuário: 3 a 40 caracteres, só letras sem acento, números, ponto, hífen ou _.');
const senha = z.string().min(6, 'A senha precisa de pelo menos 6 caracteres.').max(200);
const role = z.enum(['admin', 'colaborador'], { error: 'Perfil inválido.' });

export const novoUsuario = z.object({ nome, usuario, senha, role });
export const edicaoUsuario = z.object({
  nome, role,
  ativo: z.preprocess((v) => !(v === false || v === 'nao' || v === 'false'), z.boolean()),
  senha: z.preprocess((v) => (v === '' || v == null ? undefined : v), senha.optional()),
});
export const trocaSenha = z.object({
  atual: z.string().min(1, 'Informe a senha atual.'),
  nova: senha,
});

/** Impede ficar sem nenhum administrador ativo. */
export async function garantirOutroAdmin(db: Db, exceto: number) {
  const outros = await db.select({ id: users.id }).from(users)
    .where(and(eq(users.role, 'admin'), eq(users.ativo, true), ne(users.id, exceto))).limit(1);
  if (!outros.length) throw new HttpError(409, 'É preciso manter pelo menos um administrador ativo.');
}

export async function encerrarSessoes(db: Db, userId: number) {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

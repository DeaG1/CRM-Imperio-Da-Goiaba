import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;
const KEYLEN = 64;

/** Formato: `scrypt$<salt hex>$<hash hex>` */
export async function hashPassword(senha: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(senha, salt, KEYLEN);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export async function verifyPassword(senha: string, stored: string): Promise<boolean> {
  const [algo, saltHex, hashHex] = stored.split('$');
  if (algo !== 'scrypt' || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const got = await scrypt(senha, Buffer.from(saltHex, 'hex'), expected.length);
  return got.length === expected.length && timingSafeEqual(got, expected);
}

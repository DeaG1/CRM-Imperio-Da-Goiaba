import { handle } from '@/server/http';
import { destroySession } from '@/server/session';

export const POST = handle(async () => {
  await destroySession();
  return Response.json({ ok: true });
});

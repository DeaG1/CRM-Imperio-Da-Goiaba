import { handle } from '@/server/http';
import { getCurrentUser } from '@/server/session';

export const GET = handle(async () => Response.json({ user: await getCurrentUser() }));

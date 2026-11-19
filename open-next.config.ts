import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// O CRM é todo dinâmico (dados por usuário, sem ISR): não precisa de cache incremental em R2.
export default defineCloudflareConfig({});

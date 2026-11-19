import type { NextConfig } from "next";

// Sem Cache Components / PPR: o CRM é todo dinâmico (dados por usuário) e, no runtime
// da Cloudflare, o Cache Components travava a renderização da página inicial.
const nextConfig: NextConfig = {};

export default nextConfig;

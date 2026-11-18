'use client';

import dynamic from 'next/dynamic';

// O estado inicial vem do localStorage, então o CRM roda só no navegador.
const CrmApp = dynamic(() => import('./CrmApp').then((m) => m.CrmApp), { ssr: false });

export function CrmClient() {
  return <CrmApp />;
}

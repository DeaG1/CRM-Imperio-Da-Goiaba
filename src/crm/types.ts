import type { CrmApp } from './CrmApp';

/** Tudo o que as telas recebem — inferido de CrmApp.renderVals(). */
export type Vals = ReturnType<CrmApp['renderVals']>;

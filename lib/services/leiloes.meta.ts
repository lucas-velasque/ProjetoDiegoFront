const META_KEY = 'poketrade_leilao_meta_v1';

export type LeilaoMeta = {
  raridade?: string;
  estadoCarta?: string;
};

export function getAllLeilaoMeta(): Record<string, LeilaoMeta> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(META_KEY);
    return raw ? (JSON.parse(raw) as Record<string, LeilaoMeta>) : {};
  } catch {
    return {};
  }
}

export function getLeilaoMeta(id: string): LeilaoMeta | undefined {
  const all = getAllLeilaoMeta();
  return all[id];
}

export function setLeilaoMeta(id: string, meta: LeilaoMeta): void {
  if (typeof window === 'undefined') return;
  const all = getAllLeilaoMeta();
  all[id] = { ...(all[id] ?? {}), ...meta };
  window.localStorage.setItem(META_KEY, JSON.stringify(all));
}

export function deleteLeilaoMeta(id: string): void {
  if (typeof window === 'undefined') return;
  const all = getAllLeilaoMeta();
  delete all[id];
  window.localStorage.setItem(META_KEY, JSON.stringify(all));
}

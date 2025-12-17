import type { ListLeiloesParams } from './leiloes.client';
import { setLeilaoMeta, deleteLeilaoMeta, getLeilaoMeta } from './leiloes.meta';

export type LeilaoStatus = 'ativo' | 'inativo' | 'cancelado' | 'aberto' | 'encerrado' | string;

export type Leilao = {
  id: string;
  status: LeilaoStatus;
  titulo: string;
  descricao?: string;
  precoInicial: number;
  precoAtual: number;
  valor_incremento: number;
  terminaEm: string;
  ativo: boolean;
  ownerId?: string;
  ownerNome?: string;
  createdAt: string;
  updatedAt: string;
  raridade?: string;
  estadoCarta?: string;
};

export type ListLeiloesResult = {
  items: Leilao[];
  total: number;
  page: number;
  limit: number;
};

const LS_KEY = 'poketrade_leiloes_mock_v1';

function nowIso() {
  return new Date().toISOString();
}

function seed(ownerId?: string, ownerNome?: string): Leilao[] {
  const base: Leilao[] = [
    {
      id: 'mock-1',
      status: 'ativo',
      titulo: 'Charizard (mock) - 1ª Edição',
      descricao: 'Seu leilão',
      precoInicial: 10,
      precoAtual: 14.25,
      valor_incremento: 1,
      terminaEm: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
      ativo: true,
      ownerId,
      ownerNome,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      raridade: 'Rara',
      estadoCarta: 'Seminova',
    },
    {
      id: 'mock-2',
      status: 'ativo',
      titulo: 'Eevee - Near Mint',
      descricao: 'Seu leilão',
      precoInicial: 3,
      precoAtual: 7.9,
      valor_incremento: 1,
      terminaEm: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString(),
      ativo: true,
      ownerId,
      ownerNome,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      raridade: 'Comum',
      estadoCarta: 'Nova',
    },
  ];
  return base;
}

function load(ownerId?: string, ownerNome?: string): Leilao[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) {
      const s = seed(ownerId, ownerNome);
      window.localStorage.setItem(LS_KEY, JSON.stringify(s));
      // persist meta
      for (const l of s) setLeilaoMeta(l.id, { raridade: l.raridade, estadoCarta: l.estadoCarta });
      return s;
    }
    const list = JSON.parse(raw) as Leilao[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function save(list: Leilao[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(list));
}

function contains(hay: string, q: string) {
  return hay.toLowerCase().includes(q.toLowerCase());
}

export async function listLeiloes(params: ListLeiloesParams): Promise<ListLeiloesResult> {
  const page = Math.max(1, Number(params.page ?? 1));
  const limit = Math.max(1, Math.min(100, Number(params.limit ?? 10)));

  let items = load(params.ownerId, params.ownerId ? params.ownerId : params.ownerId);

  // scope mine
  if (params.scope === 'mine' && params.ownerId) {
    items = items.filter((l) => l.ownerId === params.ownerId);
  }

  // enrich meta if missing
  items = items.map((l) => {
    const meta = getLeilaoMeta(l.id);
    return { ...l, raridade: l.raridade ?? meta?.raridade, estadoCarta: l.estadoCarta ?? meta?.estadoCarta };
  });

  if (params.q) {
    const q = params.q.trim();
    if (q) items = items.filter((l) => contains(l.titulo + ' ' + (l.descricao ?? ''), q));
  }
  if (params.status && params.status !== 'todos') {
    items = items.filter((l) => String(l.status).toLowerCase() === String(params.status).toLowerCase());
  }
  if (params.raridade && params.raridade !== 'todos') {
    items = items.filter((l) => String(l.raridade ?? '').toLowerCase() === String(params.raridade).toLowerCase());
  }
  if (params.estadoCarta && params.estadoCarta !== 'todos') {
    items = items.filter((l) => String(l.estadoCarta ?? '').toLowerCase() === String(params.estadoCarta).toLowerCase());
  }

  // date range on terminaEm
  if (params.dateFrom) {
    const f = new Date(params.dateFrom).getTime();
    if (Number.isFinite(f)) items = items.filter((l) => new Date(l.terminaEm).getTime() >= f);
  }
  if (params.dateTo) {
    const t = new Date(params.dateTo).getTime();
    if (Number.isFinite(t)) items = items.filter((l) => new Date(l.terminaEm).getTime() <= t);
  }

  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = items.length;
  const start = (page - 1) * limit;
  const pageItems = items.slice(start, start + limit);

  return { items: pageItems, total, page, limit };
}

export async function getLeilao(id: string): Promise<Leilao> {
  const items = load();
  const found = items.find((l) => l.id === id);
  if (!found) throw new Error('Leilão não encontrado.');
  const meta = getLeilaoMeta(found.id);
  return { ...found, raridade: found.raridade ?? meta?.raridade, estadoCarta: found.estadoCarta ?? meta?.estadoCarta };
}

export async function createLeilao(input: any): Promise<Leilao> {
  const items = load(input.ownerId, input.ownerNome);
  const created: Leilao = {
    id: `mock-${Math.random().toString(16).slice(2)}`,
    status: input.status ?? 'ativo',
    titulo: input.titulo,
    descricao: input.descricao ?? '',
    precoInicial: Number(input.precoInicial ?? 0),
    precoAtual: Number(input.precoInicial ?? 0),
    valor_incremento: Number(input.valor_incremento ?? 1),
    terminaEm: input.terminaEm,
    ativo: true,
    ownerId: input.ownerId,
    ownerNome: input.ownerNome,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    raridade: input.raridade,
    estadoCarta: input.estadoCarta,
  };
  items.unshift(created);
  save(items);
  if (created.id) setLeilaoMeta(created.id, { raridade: created.raridade, estadoCarta: created.estadoCarta });
  return created;
}

export async function updateLeilao(id: string, patch: any): Promise<Leilao> {
  const items = load();
  const idx = items.findIndex((l) => l.id === id);
  if (idx === -1) throw new Error('Leilão não encontrado.');
  const updated = { ...items[idx], ...patch, updatedAt: nowIso() } as Leilao;
  items[idx] = updated;
  save(items);
  if (updated.id) setLeilaoMeta(updated.id, { raridade: updated.raridade, estadoCarta: updated.estadoCarta });
  return updated;
}

export async function deleteLeilao(id: string): Promise<void> {
  const items = load();
  const next = items.filter((l) => l.id !== id);
  save(next);
  deleteLeilaoMeta(id);
}

export async function toggleAtivo(id: string): Promise<Leilao> {
  const current = await getLeilao(id);
  return updateLeilao(id, { ativo: !current.ativo });
}

'use client';

import type { LeilaoMock, LeilaoStatus } from '@/lib/mocks/leiloes.mock';
import { MOCK_STORAGE_KEY, seedLeiloes } from '@/lib/mocks/leiloes.mock';

export type ListParams = {
  q?: string;
  status?: LeilaoStatus | 'todos';
  terminaDe?: string; // yyyy-mm-dd
  terminaAte?: string; // yyyy-mm-dd
  page?: number;
  limit?: number;
  scope?: 'all' | 'mine';
  ownerId?: string;
  // Apenas para mock/UX (não afeta filtros): nome exibido do dono do leilão ao bootstrapar dados.
  ownerNome?: string;
};

export type ListResult = {
  items: LeilaoMock[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

function ensureSeed(): LeilaoMock[] {
  const existing = safeParse<LeilaoMock[]>(
    typeof window !== 'undefined' ? window.localStorage.getItem(MOCK_STORAGE_KEY) : null
  );
  if (existing && Array.isArray(existing) && existing.length > 0) return existing;

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(seedLeiloes));
  }
  return seedLeiloes;
}

function writeAll(data: LeilaoMock[]) {
  window.localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(data));
}

function genId(prefix = 'l_') {
  // randomUUID é o melhor, mas nem sempre existe em runtimes antigos
  const anyCrypto = (globalThis as any).crypto;
  if (anyCrypto?.randomUUID) return prefix + anyCrypto.randomUUID();
  return prefix + Math.floor(Math.random() * 900000 + 100000).toString();
}

function bootstrapMineIfEmpty(all: LeilaoMock[], ownerId: string, ownerNome?: string) {
  // Só faz bootstrap se o usuário ainda não tem nenhum leilão salvo no mock.
  const hasAny = all.some(l => l.ownerId === ownerId);
  if (hasAny) return all;

  const nome = (ownerNome?.trim() || 'Você').slice(0, 80);
  const now = Date.now();

  // Cria alguns exemplos (ativos e 1 finalizado) para o usuário conseguir testar filtros/paginação/CRUD.
  const samples: LeilaoMock[] = [
    {
      id: genId(),
      titulo: 'Charizard (mock) - 1ª Edição',
      descricao: 'Exemplo de leilão criado automaticamente para testes de UI (usuário).',
      precoInicial: 10.0,
      precoAtual: 14.25,
      status: 'ativo',
      terminaEm: new Date(now + 1000 * 60 * 60 * 24 * 2).toISOString(),
      ownerId,
      ownerNome: nome,
      createdAt: new Date(now - 1000 * 60 * 60).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 30).toISOString(),
    },
    {
      id: genId(),
      titulo: 'Pikachu (mock) - Holo',
      descricao: 'Leilão de exemplo para testar busca e edição.',
      precoInicial: 5.0,
      precoAtual: 5.0,
      status: 'ativo',
      terminaEm: new Date(now + 1000 * 60 * 60 * 12).toISOString(),
      ownerId,
      ownerNome: nome,
      createdAt: new Date(now - 1000 * 60 * 20).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 20).toISOString(),
    },
    {
      id: genId(),
      titulo: 'Eevee (mock) - Near Mint',
      descricao: 'Um exemplo finalizado para testar filtro de status.',
      precoInicial: 3.0,
      precoAtual: 7.9,
      status: 'finalizado',
      terminaEm: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
      ownerId,
      ownerNome: nome,
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
  ];

  const next = [...all, ...samples];
  writeAll(next);
  return next;
}

function toMoney(n: unknown): number {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
}

function normalizeDateInput(d?: string): number | null {
  if (!d) return null;
  const dt = new Date(d);
  const t = dt.getTime();
  return Number.isFinite(t) ? t : null;
}

export function canEdit(leilao: LeilaoMock, opts: { isAdmin: boolean; userId?: string }) {
  if (opts.isAdmin) return true;
  if (!opts.userId) return false;
  return leilao.ownerId === opts.userId;
}

export async function listLeiloes(params: ListParams): Promise<ListResult> {
  let all = ensureSeed();

  const q = (params.q ?? '').trim().toLowerCase();
  const status = params.status ?? 'todos';
  const scope = params.scope ?? 'all';
  const ownerId = params.ownerId;

  // Se o usuário nunca teve dados mockados, criamos alguns exemplos automaticamente
  // para a tela "Meus Leilões" não ficar vazia.
  if (scope === 'mine' && ownerId) {
    all = bootstrapMineIfEmpty(all, ownerId, params.ownerNome);
  }

  let filtered = [...all];

  if (scope === 'mine' && ownerId) {
    filtered = filtered.filter(l => l.ownerId === ownerId);
  }

  if (q) {
    filtered = filtered.filter(l =>
      l.titulo.toLowerCase().includes(q) ||
      (l.descricao ?? '').toLowerCase().includes(q) ||
      l.ownerNome.toLowerCase().includes(q)
    );
  }

  if (status !== 'todos') {
    filtered = filtered.filter(l => l.status === status);
  }

  const de = normalizeDateInput(params.terminaDe);
  const ate = normalizeDateInput(params.terminaAte);
  if (de != null) {
    filtered = filtered.filter(l => new Date(l.terminaEm).getTime() >= de);
  }
  if (ate != null) {
    const end = ate + (1000 * 60 * 60 * 24 - 1);
    filtered = filtered.filter(l => new Date(l.terminaEm).getTime() <= end);
  }

  filtered.sort((a, b) => new Date(a.terminaEm).getTime() - new Date(b.terminaEm).getTime());

  const page = Math.max(1, Number(params.page ?? 1));
  const limit = Math.min(50, Math.max(5, Number(params.limit ?? 10)));
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return { items, total, page, limit, pages };
}

export async function getLeilaoById(id: string): Promise<LeilaoMock | null> {
  const all = ensureSeed();
  return all.find(l => l.id === id) ?? null;
}

export async function createLeilao(input: {
  titulo: string;
  descricao?: string;
  precoInicial: number;
  terminaEm: string; // ISO
  ownerId: string;
  ownerNome: string;
}): Promise<LeilaoMock> {
  const all = ensureSeed();

  const id = 'l_' + Math.floor(Math.random() * 900000 + 100000).toString();
  const precoInicial = Math.max(0.01, toMoney(input.precoInicial));
  const nowIso = new Date().toISOString();

  const created: LeilaoMock = {
    id,
    titulo: input.titulo.trim(),
    descricao: input.descricao?.trim() || '',
    precoInicial,
    precoAtual: precoInicial,
    status: 'ativo',
    terminaEm: input.terminaEm,
    criadoEm: nowIso,
    ownerId: input.ownerId,
    ownerNome: input.ownerNome || 'Usuário',
  };

  const next = [created, ...all];
  writeAll(next);
  return created;
}

export async function updateLeilao(
  id: string,
  patch: Partial<Pick<LeilaoMock,'titulo'|'descricao'|'precoInicial'|'precoAtual'|'status'|'terminaEm'>>
): Promise<LeilaoMock> {
  const all = ensureSeed();
  const idx = all.findIndex(l => l.id === id);
  if (idx < 0) throw new Error('Leilão não encontrado');

  const current = all[idx];
  const next: LeilaoMock = {
    ...current,
    ...patch,
    titulo: (patch.titulo ?? current.titulo).trim(),
    descricao: (patch.descricao ?? current.descricao ?? '').trim(),
    precoInicial: patch.precoInicial != null ? Math.max(0.01, toMoney(patch.precoInicial)) : current.precoInicial,
    precoAtual: patch.precoAtual != null ? Math.max(0, toMoney(patch.precoAtual)) : current.precoAtual,
    status: (patch.status ?? current.status),
    terminaEm: (patch.terminaEm ?? current.terminaEm),
  };

  const copy = [...all];
  copy[idx] = next;
  writeAll(copy);
  return next;
}

export async function deleteLeilao(id: string): Promise<void> {
  const all = ensureSeed();
  const next = all.filter(l => l.id !== id);
  writeAll(next);
}

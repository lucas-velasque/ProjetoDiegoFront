import { apiClient } from '@/lib/api/client';

type ApiFetchOptions = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
};

async function apiFetch(path: string, options: ApiFetchOptions = {}) {
  const method = (options.method ?? 'GET') as any;
  const headers: Record<string, string> = { ...(options.headers ?? {}) };
  const data = options.body;

  // Se vier JSON string, garante Content-Type
  if (typeof data === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await apiClient.request({
    url: path,
    method,
    data,
    headers,
  });

  return res.data;
}

import type { ListLeiloesParams } from './leiloes.client';
import { getLeilaoMeta } from './leiloes.meta';

export type LeilaoStatus = 'aberto' | 'encerrado' | 'cancelado' | 'ativo' | 'inativo' | string;

export type Leilao = {
  id: string;
  titulo: string;
  descricao?: string | null;
  status?: LeilaoStatus | null;
  precoInicial?: number | string | null;
  precoAtual?: number | string | null;
  valor_incremento?: number | string | null;
  terminaEm?: string | null;
  ativo?: boolean | null;
  vendedorId?: number | null;
  categoriaLeilaoId?: number | null;
  ganhadorId?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  lances?: any[];
  // enriquecido via localStorage:
  raridade?: string;
  estadoCarta?: string;
};

export type ListLeiloesResult = {
  items: Leilao[];
  total: number;
  page: number;
  limit: number;
};

function toNumber(v: any): number {
  if (v === null || v === undefined) return 0;
  const n = typeof v === 'number' ? v : Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function normalizeLeilao(raw: any): Leilao {
  const l: Leilao = {
    id: String(raw?.id ?? ''),
    titulo: raw?.titulo ?? '',
    descricao: raw?.descricao ?? '',
    status: raw?.status ?? '',
    precoInicial: toNumber(raw?.precoInicial),
    precoAtual: toNumber(raw?.precoAtual),
    valor_incremento: toNumber(raw?.valor_incremento),
    terminaEm: raw?.terminaEm ?? null,
    ativo: raw?.ativo ?? true,
    vendedorId: raw?.vendedorId ?? null,
    categoriaLeilaoId: raw?.categoriaLeilaoId ?? null,
    ganhadorId: raw?.ganhadorId ?? null,
    createdAt: raw?.createdAt ?? null,
    updatedAt: raw?.updatedAt ?? null,
    lances: raw?.lances ?? [],
  };

  // Enriquecer com meta (raridade/estado) caso exista
  if (typeof window !== 'undefined' && l.id) {
    const meta = getLeilaoMeta(l.id);
    if (meta?.raridade) l.raridade = meta.raridade;
    if (meta?.estadoCarta) l.estadoCarta = meta.estadoCarta;
  }

  return l;
}

function matchesSearch(leilao: Leilao, q: string): boolean {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  const hay = `${leilao.titulo ?? ''} ${leilao.descricao ?? ''}`.toLowerCase();
  return hay.includes(s);
}

function inDateRange(leilao: Leilao, from?: string, to?: string): boolean {
  if (!from && !to) return true;
  const t = leilao.terminaEm ? new Date(leilao.terminaEm).getTime() : NaN;
  if (!Number.isFinite(t)) return false;
  if (from) {
    const f = new Date(from).getTime();
    if (Number.isFinite(f) && t < f) return false;
  }
  if (to) {
    const u = new Date(to).getTime();
    if (Number.isFinite(u) && t > u) return false;
  }
  return true;
}

function matchesSelect(v?: string, expected?: string): boolean {
  if (!expected || expected === 'Todos' || expected === 'todos') return true;
  return String(v ?? '').toLowerCase() === String(expected).toLowerCase();
}

export async function listLeiloes(params: ListLeiloesParams): Promise<ListLeiloesResult> {
  const page = Math.max(1, Number(params.page ?? 1));
  const limit = Math.max(1, Math.min(100, Number(params.limit ?? 10)));

  // Backend atual: GET /leiloes retorna todos
  const json: any = await apiFetch('/leiloes', { method: 'GET' });
  const rawList = json?.data ?? json ?? [];
  const all: Leilao[] = Array.isArray(rawList) ? rawList.map(normalizeLeilao) : [];

  // Filtros (client-side para não depender do backend)
  let filtered = all;

  if (params.scope === 'mine' && typeof params.ownerDbId === 'number') {
    filtered = filtered.filter((l) => Number(l.vendedorId) === Number(params.ownerDbId));
  }

  if (params.q) filtered = filtered.filter((l) => matchesSearch(l, params.q!));
  if (params.status && params.status !== 'todos') filtered = filtered.filter((l) => matchesSelect(l.status ?? '', params.status));
  if (params.raridade && params.raridade !== 'todos') filtered = filtered.filter((l) => matchesSelect(l.raridade ?? '', params.raridade));
  if (params.estadoCarta && params.estadoCarta !== 'todos') filtered = filtered.filter((l) => matchesSelect(l.estadoCarta ?? '', params.estadoCarta));
  filtered = filtered.filter((l) => inDateRange(l, params.dateFrom, params.dateTo));

  // Ordenação: mais recentes primeiro (createdAt)
  filtered.sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tb - ta;
  });

  const total = filtered.length;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return { items, total, page, limit };
}

export async function getLeilao(id: string): Promise<Leilao> {
  const json: any = await apiFetch(`/leiloes/${encodeURIComponent(id)}`, { method: 'GET' });
  const raw = json?.data ?? json;
  return normalizeLeilao(raw);
}

export type CreateLeilaoInput = {
  titulo: string;
  descricao?: string;
  precoInicial: number;
  status?: LeilaoStatus;
  terminaEm: string;
  valor_incremento?: number;
  vendedorId?: number; // importante para criar corretamente no banco
};

export async function createLeilao(input: CreateLeilaoInput): Promise<Leilao> {
  const json: any = await apiFetch('/leiloes', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  const raw = json?.data ?? json;
  return normalizeLeilao(raw);
}

export async function updateLeilao(id: string, patch: Partial<CreateLeilaoInput>): Promise<Leilao> {
  const json: any = await apiFetch(`/leiloes/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });

  const raw = json?.data ?? json;
  return normalizeLeilao(raw);
}

export async function deleteLeilao(id: string): Promise<void> {
  await apiFetch(`/leiloes/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function toggleAtivo(id: string): Promise<Leilao> {
  // Alterna ativo via PATCH simples (backend deve aceitar)
  const current = await getLeilao(id);
  const nextAtivo = !Boolean(current.ativo);

  const json: any = await apiFetch(`/leiloes/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ ativo: nextAtivo }),
  });

  const raw = json?.data ?? json;
  return normalizeLeilao(raw);
}
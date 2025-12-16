'use client';

import type { LeilaoMock, LeilaoStatus } from '@/lib/mocks/leiloes.mock';
import type { ListParams, ListResult } from '@/lib/services/leiloes.mock.client';

export type Leilao = LeilaoMock;

function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'http://localhost:3000'
  );
}

function getToken(): string | null {
  // Se você tiver token JWT salvo em algum lugar do front, ajuste aqui.
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

function normalizeLeilao(raw: any): Leilao {
  const id = String(raw?.id ?? raw?._id ?? raw?.uuid ?? crypto.randomUUID());

  const titulo = raw?.titulo ?? raw?.title ?? raw?.nome ?? 'Leilão';
  const descricao = raw?.descricao ?? raw?.description ?? '';

  const precoInicial = Number(raw?.precoInicial ?? raw?.preco_inicial ?? raw?.preco_inicial ?? raw?.valor_inicial ?? raw?.preco ?? 0);
  const precoAtual = Number(raw?.precoAtual ?? raw?.preco_atual ?? raw?.preco_atual ?? raw?.valor_atual ?? precoInicial);

  const status = (raw?.status ?? 'ativo') as LeilaoStatus;

  const terminaEm = String(
    raw?.terminaEm ??
      raw?.termina_em ??
      raw?.termina_em ??
      raw?.data_fim ??
      raw?.dataFim ??
      raw?.fim ??
      new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
  );

  const ownerId = String(
    raw?.ownerId ??
      raw?.usuario_id ??
      raw?.userId ??
      raw?.vendedorId ??
      raw?.vendedorId ??
      raw?.vendedor_id ??
      'user_1'
  );

  const ownerNome =
    raw?.ownerNome ??
    raw?.usuarioNome ??
    raw?.user?.nome ??
    raw?.user?.username ??
    raw?.usuario?.username ??
    raw?.username ??
    'Usuário';

  const criadoEm = String(raw?.criadoEm ?? raw?.createdAt ?? raw?.created_at ?? new Date().toISOString());

  return {
    id,
    titulo,
    descricao,
    precoInicial,
    precoAtual,
    status,
    terminaEm,
    ownerId,
    ownerNome,
    criadoEm,
  };
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiBaseUrl();
  const url = `${base}${path.startsWith('/') ? '' : '/'}${path}`;

  const token = getToken();
  const headers: HeadersInit = {
    ...(init?.headers ?? {}),
  };
  if (!('Content-Type' in (headers as any))) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...init,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`API ${res.status} em ${path}: ${text}`);
    (err as any).status = res.status;
    throw err;
  }

  return (await res.json()) as T;
}

export async function listLeiloes(params: ListParams): Promise<ListResult> {
  const q = new URLSearchParams();
  q.set('page', String(params.page));
  q.set('limit', String(params.limit));

  if (params.q) q.set('q', params.q);
  if (params.status && params.status !== 'todos') q.set('status', params.status);

  // Caso o backend suporte, você pode enviar filtro de "meus leilões".
  if (params.scope === 'mine' && params.ownerId) q.set('ownerId', params.ownerId);

  const json: any = await apiFetch(`/leiloes?${q.toString()}`);

  const rawItems =
    Array.isArray(json) ? json :
    Array.isArray(json?.items) ? json.items :
    Array.isArray(json?.data) ? json.data :
    Array.isArray(json?.rows) ? json.rows :
    [];

  const items = rawItems.map(normalizeLeilao);

  const total =
    Number(json?.meta?.total ?? json?.total ?? json?.count ?? items.length);

  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const pages = Math.ceil(total / limit);

  return {
    items,
    total,
    page,
    limit,
    pages,
  };
}

export async function getLeilaoById(id: string): Promise<Leilao | null> {
  const json: any = await apiFetch(`/leiloes/${encodeURIComponent(id)}`);
  const raw = json?.data ?? json;
  if (!raw) return null;
  return normalizeLeilao(raw);
}

export type CreateLeilaoInput = {
  titulo: string;
  descricao?: string;
  precoInicial: number;
  status?: LeilaoStatus;
  terminaEm: string;
};

export async function createLeilao(input: CreateLeilaoInput): Promise<Leilao> {
  const json: any = await apiFetch('/leiloes', {
    method: 'POST',
    body: JSON.stringify({
      titulo: input.titulo,
      descricao: input.descricao ?? '',
      precoInicial: input.precoInicial,
      status: input.status ?? 'ativo',
      terminaEm: input.terminaEm,
    }),
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

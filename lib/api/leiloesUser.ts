export type LeilaoUser = {
  id: string;
  titulo: string;
  descricao?: string;
  precoInicial: number;
  precoAtual: number;
  status: 'aberto' | 'finalizado' | string;
  terminaEm: string; // ISO
};

type ListParams = {
  page?: number;
  limit?: number;
  titulo?: string;
  q?: string;
};

type ListResult = {
  items: LeilaoUser[];
  page: number;
  totalPages: number;
  total: number;
};

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function errMsg(payload: any) {
  if (!payload) return 'Erro inesperado.';
  if (typeof payload === 'string') return payload;
  if (payload.message) return Array.isArray(payload.message) ? payload.message.join(', ') : String(payload.message);
  return 'Erro inesperado.';
}

function normalizeLeilao(raw: any): LeilaoUser {
  return {
    id: String(raw?.id ?? ''),
    titulo: raw?.titulo ?? '',
    descricao: raw?.descricao ?? '',
    precoInicial: Number(raw?.precoInicial ?? 0),
    precoAtual: Number(raw?.precoAtual ?? raw?.precoInicial ?? 0),
    status: raw?.status ?? 'aberto',
    terminaEm: raw?.terminaEm ?? new Date().toISOString(),
  };
}

export async function listarMeusLeiloes(params: ListParams = {}): Promise<ListResult> {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.titulo || params.q) qs.set('titulo', params.titulo || params.q || '');

  const res = await fetch(`${API_URL}/leiloes?${qs.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  const payload = await parseJsonSafe(res);
  if (!res.ok) throw new Error(errMsg(payload));

  // Normalizar resposta do backend
  const rawItems = Array.isArray(payload) ? payload : (payload?.data ?? payload?.items ?? []);
  const items = rawItems.map(normalizeLeilao);
  
  const total = Number(payload?.meta?.total ?? payload?.total ?? items.length);
  const page = Number(payload?.meta?.page ?? payload?.page ?? params.page ?? 1);
  const limit = Number(payload?.meta?.limit ?? payload?.limit ?? params.limit ?? 10);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return { items, page, totalPages, total };
}

export async function obterMeuLeilao(id: string): Promise<LeilaoUser> {
  if (!id) throw new Error('ID inválido.');

  const res = await fetch(`${API_URL}/leiloes/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  const payload = await parseJsonSafe(res);
  if (!res.ok) throw new Error(errMsg(payload));
  
  const raw = payload?.data ?? payload;
  return normalizeLeilao(raw);
}

export async function criarMeuLeilao(input: Partial<LeilaoUser> & { valor_incremento?: number; vendedorId?: number }) {
  const res = await fetch(`${API_URL}/leiloes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titulo: input.titulo,
      descricao: input.descricao ?? '',
      precoInicial: input.precoInicial,
      status: input.status ?? 'aberto',
      terminaEm: input.terminaEm,
      valor_incremento: input.valor_incremento ?? 1,
      vendedorId: input.vendedorId ?? 1,
    }),
  });

  const payload = await parseJsonSafe(res);
  if (!res.ok) throw new Error(errMsg(payload));
  return payload;
}

export async function atualizarMeuLeilao(id: string, input: Partial<LeilaoUser>) {
  if (!id) throw new Error('ID inválido.');

  const res = await fetch(`${API_URL}/leiloes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const payload = await parseJsonSafe(res);
  if (!res.ok) throw new Error(errMsg(payload));
  return payload;
}

export async function excluirMeuLeilao(id: string) {
  if (!id) throw new Error('ID inválido.');

  const res = await fetch(`${API_URL}/leiloes/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  const payload = await parseJsonSafe(res);
  if (!res.ok) throw new Error(errMsg(payload));
  return payload;
}

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
};

const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

// Mock local
let MOCK: LeilaoUser[] = [
  {
    id: '1',
    titulo: 'Charizard 1ª Edição',
    descricao: 'Carta rara. Estado: Muito boa.',
    precoInicial: 50,
    precoAtual: 120,
    status: 'aberto',
    terminaEm: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: '2',
    titulo: 'Pikachu Promo',
    descricao: 'Carta promocional.',
    precoInicial: 10,
    precoAtual: 10,
    status: 'finalizado',
    terminaEm: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

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


export async function listarMeusLeiloes(params: ListParams = {}): Promise<{ data: LeilaoUser[] } & any> {
  if (!API_URL) {
    // filtro local (mock)
    const titulo = (params.titulo || '').toLowerCase();
    const filtered = titulo ? MOCK.filter((l) => l.titulo.toLowerCase().includes(titulo)) : MOCK;
    return { data: filtered } as any;
  }

  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.titulo) qs.set('titulo', params.titulo);

  const res = await fetch(`${API_URL}/leiloes/meus?${qs.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    cache: 'no-store',
  });

  const payload = await parseJsonSafe(res);
  if (!res.ok) throw new Error(errMsg(payload));

  // aceite tanto {data:[...]} quanto [...]
  const data = Array.isArray(payload) ? payload : payload?.data;
  return { ...(payload || {}), data };
}

export async function obterMeuLeilao(id: string): Promise<LeilaoUser> {
  if (!id) throw new Error('ID inválido.');

  if (!API_URL) {
    const found = MOCK.find((l) => l.id === String(id));
    if (!found) throw new Error('Leilão não encontrado (mock).');
    return found;
  }

  const res = await fetch(`${API_URL}/leiloes/meus/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    cache: 'no-store',
  });

  const payload = await parseJsonSafe(res);
  if (!res.ok) throw new Error(errMsg(payload));
  return (payload?.data ?? payload) as LeilaoUser;
}

export async function criarMeuLeilao(input: Partial<LeilaoUser>) {
  if (!API_URL) {
    const created: LeilaoUser = {
      id: String(Date.now()),
      titulo: String(input.titulo || 'Sem título'),
      descricao: input.descricao || '',
      precoInicial: Number(input.precoInicial ?? 0),
      precoAtual: Number(input.precoInicial ?? 0),
      status: 'aberto',
      terminaEm: String(input.terminaEm || new Date().toISOString()),
    };
    MOCK = [created, ...MOCK];
    return { data: created };
  }

  const res = await fetch(`${API_URL}/leiloes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  });

  const payload = await parseJsonSafe(res);
  if (!res.ok) throw new Error(errMsg(payload));
  return payload;
}

export async function atualizarMeuLeilao(id: string, input: Partial<LeilaoUser>) {
  if (!id) throw new Error('ID inválido.');

  if (!API_URL) {
    MOCK = MOCK.map((l) => (l.id === String(id) ? { ...l, ...input } as LeilaoUser : l));
    return { ok: true };
  }

  const res = await fetch(`${API_URL}/leiloes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  });

  const payload = await parseJsonSafe(res);
  if (!res.ok) throw new Error(errMsg(payload));
  return payload;
}

export async function excluirMeuLeilao(id: string) {
  if (!id) throw new Error('ID inválido.');

  if (!API_URL) {
    MOCK = MOCK.filter((l) => l.id !== String(id));
    return { ok: true };
  }

  const res = await fetch(`${API_URL}/leiloes/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const payload = await parseJsonSafe(res);
  if (!res.ok) throw new Error(errMsg(payload));
  return payload;
}

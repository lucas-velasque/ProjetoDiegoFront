import {
  ApiResponse,
  AtualizarLeilaoInput,
  CriarLeilaoInput,
  Leilao,
  ListarLeiloesParams,
  Paginated,
} from "../types/leilao";

/**
 * OBS:
 * - Este módulo usa fetch (não depende de axios).
 * - Exporta tanto funções nomeadas quanto `leiloesApi` para compatibilidade
 *   com projetos que já importavam `leiloesApi`.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URI || "http://localhost:3000";

function buildQuery(params: Record<string, unknown>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    sp.set(k, String(v));
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
}

function extractErrorMessage(payload: any): string {
  if (!payload) return "Erro desconhecido";
  if (Array.isArray(payload.message)) return payload.message.join(", ");
  if (typeof payload.message === "string") return payload.message;
  if (typeof payload.error === "string") return payload.error;
  return "Erro ao processar requisição";
}

export async function listarLeiloes(
  params: ListarLeiloesParams = {}
): Promise<Paginated<Leilao>> {
  const qs = buildQuery({ page: 1, limit: 20, ...params });
  const res = await fetch(`${API_URL}/leiloes${qs}`, { cache: "no-store" });
  const payload = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(extractErrorMessage(payload));
  }

  const items: Leilao[] = Array.isArray(payload)
    ? payload
    : (payload.items as Leilao[]) || (payload.data as Leilao[]) || [];

  return {
    items,
    total: payload.total,
    page: payload.page,
    limit: payload.limit,
  };
}

export async function buscarLeilao(id: string): Promise<Leilao> {
  const res = await fetch(`${API_URL}/leiloes/${id}`, { cache: "no-store" });
  const payload = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(extractErrorMessage(payload));
  }

  const leilao: Leilao = (payload.data as Leilao) || (payload as Leilao);
  return leilao;
}

export async function criarLeilao(input: CriarLeilaoInput): Promise<Leilao> {
  const res = await fetch(`${API_URL}/leiloes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const payload: ApiResponse<Leilao> = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(extractErrorMessage(payload));
  }

  return (payload.data as Leilao) || (payload as any);
}

export async function atualizarLeilao(
  id: string,
  input: AtualizarLeilaoInput
): Promise<Leilao> {
  const res = await fetch(`${API_URL}/leiloes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const payload: ApiResponse<Leilao> = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(extractErrorMessage(payload));
  }

  return (payload.data as Leilao) || (payload as any);
}

export async function excluirLeilao(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/leiloes/${id}`, {
    method: "DELETE",
  });

  const payload = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(extractErrorMessage(payload));
  }
}

// ✅ compat: projetos que esperam `leiloesApi`
export const leiloesApi = {
  listarLeiloes,
  buscarLeilao,
  criarLeilao,
  atualizarLeilao,
  excluirLeilao,
};

export default leiloesApi;

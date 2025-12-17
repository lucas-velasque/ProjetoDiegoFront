import * as api from './leiloes.api.client';
import * as mock from './leiloes.mock.client';

const USE_MOCK_KEY = 'poketrade_use_mock_leiloes_v1';

export function getUseMockLeiloes(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = window.localStorage.getItem(USE_MOCK_KEY);
  if (stored === null) {
    // Default: API (real backend)
    const envDefault = (process.env.NEXT_PUBLIC_USE_MOCK_LEILOES || '').toLowerCase() === 'true';
    return envDefault;
  }
  return stored === 'true';
}

export function setUseMockLeiloes(v: boolean): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USE_MOCK_KEY, v ? 'true' : 'false');
}

export type LeilaoStatus = api.LeilaoStatus;
export type Leilao = api.Leilao;

export type ListLeiloesParams = {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  scope?: 'all' | 'mine';
  ownerId?: string;      // Clerk userId (used by mock)
  ownerDbId?: number;    // users.id no Postgres (used by API filter)
  raridade?: string;
  estadoCarta?: string;
};

export type ListLeiloesResult = api.ListLeiloesResult;

export async function listLeiloes(params: ListLeiloesParams): Promise<ListLeiloesResult> {
  return getUseMockLeiloes() ? mock.listLeiloes(params as any) : api.listLeiloes(params as any);
}

export async function getLeilao(id: string): Promise<Leilao> {
  return getUseMockLeiloes() ? mock.getLeilao(id) : api.getLeilao(id);
}

export type CreateLeilaoInput = api.CreateLeilaoInput & {
  ownerId?: string;
  ownerNome?: string;
  raridade?: string;
  estadoCarta?: string;
};

function stripApiOnly(input: CreateLeilaoInput): api.CreateLeilaoInput {
  const { ownerId, ownerNome, raridade, estadoCarta, ...rest } = input;
  return rest;
}

export async function createLeilao(input: CreateLeilaoInput): Promise<Leilao> {
  return getUseMockLeiloes() ? mock.createLeilao(input as any) : api.createLeilao(stripApiOnly(input));
}

export async function updateLeilao(id: string, patch: Partial<CreateLeilaoInput>): Promise<Leilao> {
  return getUseMockLeiloes() ? mock.updateLeilao(id, patch as any) : api.updateLeilao(id, stripApiOnly(patch as any));
}

export async function deleteLeilao(id: string): Promise<void> {
  return getUseMockLeiloes() ? mock.deleteLeilao(id) : api.deleteLeilao(id);
}

export async function toggleAtivo(id: string): Promise<Leilao> {
  return getUseMockLeiloes() ? mock.toggleAtivo(id) : api.toggleAtivo(id);
}

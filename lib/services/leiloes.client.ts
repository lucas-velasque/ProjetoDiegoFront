'use client';

import type { LeilaoMock, LeilaoStatus } from '@/lib/mocks/leiloes.mock';
import type { ListParams, ListResult } from '@/lib/services/leiloes.mock.client';

import * as mock from '@/lib/services/leiloes.mock.client';
import * as api from '@/lib/services/leiloes.api.client';

export type Leilao = LeilaoMock;
export type { LeilaoStatus, ListParams, ListResult };

function source(): 'api' | 'mock' {
  const v = (process.env.NEXT_PUBLIC_LEILOES_SOURCE || '').toLowerCase();
  return v === 'api' ? 'api' : 'mock';
}

async function tryApi<T>(fn: () => Promise<T>): Promise<T | null> {
  if (source() !== 'api') return null;
  try {
    return await fn();
  } catch {
    return null;
  }
}

// Lista com fallback: se API falhar (401/500/offline), volta para o mock.
export async function listLeiloes(params: ListParams): Promise<ListResult> {
  const apiResult = await tryApi(() => api.listLeiloes(params));
  return apiResult ?? mock.listLeiloes(params);
}

export async function getLeilaoById(id: string): Promise<Leilao | null> {
  const apiResult = await tryApi(() => api.getLeilaoById(id));
  return apiResult ?? mock.getLeilaoById(id);
}

export async function createLeilao(input: api.CreateLeilaoInput): Promise<Leilao> {
  const apiResult = await tryApi(() => api.createLeilao(input));
  if (apiResult) return apiResult;
  // mock espera campos camelCase iguais + ownerId/ownerNome
  return mock.createLeilao({
    ...input,
    ownerId: 'mock-user-id',
    ownerNome: 'Mock User'
  });
}

export async function updateLeilao(id: string, patch: Partial<api.CreateLeilaoInput>): Promise<Leilao> {
  const apiResult = await tryApi(() => api.updateLeilao(id, patch));
  return apiResult ?? mock.updateLeilao(id, patch);
}

export async function deleteLeilao(id: string): Promise<void> {
  const apiResult = await tryApi(async () => {
    await api.deleteLeilao(id);
  });
  if (apiResult !== null) return;
  return mock.deleteLeilao(id);
}

// Regra de permissões no front (independente da fonte dos dados)
export function canEdit(leilao: Leilao, viewerRole: 'admin' | 'user', viewerUserId: string): boolean {
  return mock.canEdit(leilao, { isAdmin: viewerRole === 'admin', userId: viewerUserId });
}


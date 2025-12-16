import { apiClient } from './client';
import {
  Proposta,
  CreatePropostaDto,
  UpdatePropostaDto,
  FiltroPropostaDto,
  PaginatedResponse,
} from '@/types';

export const propostasApi = {
  getAll: async (filtros: FiltroPropostaDto = {}) => {
    const response = await apiClient.get<PaginatedResponse<Proposta>>(
      '/propostas',
      { params: filtros }
    );
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<{ data: Proposta }>(
      `/propostas/${id}`
    );
    return response.data.data;
  },

  getByAnuncio: async (anuncioId: number, filtros: FiltroPropostaDto = {}) => {
    const response = await apiClient.get<PaginatedResponse<Proposta>>(
      `/propostas/anuncio/${anuncioId}`,
      { params: filtros }
    );
    return response.data;
  },

  create: async (data: CreatePropostaDto) => {
    const response = await apiClient.post<{ data: Proposta; message: string }>(
      '/propostas',
      data
    );
    return response.data.data;
  },

  update: async (id: number, data: UpdatePropostaDto) => {
    const response = await apiClient.patch<{ data: Proposta; message: string }>(
      `/propostas/${id}`,
      data
    );
    return response.data.data;
  },

  accept: async (id: number) => {
    const response = await apiClient.patch<{ data: Proposta; message: string }>(
      `/propostas/${id}/aceitar`
    );
    return response.data.data;
  },

  reject: async (id: number) => {
    const response = await apiClient.patch<{ data: Proposta; message: string }>(
      `/propostas/${id}/recusar`
    );
    return response.data.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete<{ message: string }>(
      `/propostas/${id}`
    );
    return response.data;
  },
};

// Backward compatible exports for legacy code
export const getPropostasByAnuncio = async (
  tipo: 'venda' | 'compra',
  anuncioId: number,
  filtros: FiltroPropostaDto = {}
) => {
  return await propostasApi.getByAnuncio(anuncioId, filtros);
};

export const createProposta = async (
  tipo: 'venda' | 'compra',
  anuncioId: number,
  data: Omit<CreatePropostaDto, 'anuncio_id' | 'usuario_id'>
) => {
  return await propostasApi.create({ ...data, anuncio_id: anuncioId } as CreatePropostaDto);
};

export const acceptProposta = propostasApi.accept;
export const updateProposta = propostasApi.update;
export const deleteProposta = propostasApi.delete;
export const getPropostaById = propostasApi.getById;

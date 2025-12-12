import { apiClient } from './client';
import {
  AnuncioVenda,
  CreateAnuncioVendaDto,
  UpdateAnuncioVendaDto,
  FiltroAnuncioVendaDto,
  PaginatedResponse,
} from '@/types';

export const anunciosVendaApi = {
  getAll: async (filtros: FiltroAnuncioVendaDto = {}) => {
    const response = await apiClient.get<PaginatedResponse<AnuncioVenda>>(
      '/anuncios-venda',
      { params: filtros }
    );
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<{ data: AnuncioVenda }>(
      `/anuncios-venda/${id}`
    );
    return response.data.data;
  },

  create: async (data: CreateAnuncioVendaDto) => {
    const response = await apiClient.post<{ data: AnuncioVenda; message: string }>(
      '/anuncios-venda',
      data
    );
    return response.data.data;
  },

  update: async (id: number, data: UpdateAnuncioVendaDto) => {
    const response = await apiClient.patch<{ data: AnuncioVenda; message: string }>(
      `/anuncios-venda/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete<{ message: string }>(
      `/anuncios-venda/${id}`
    );
    return response.data;
  },
};

// Backward compatible exports for legacy code
export const getAnunciosVenda = anunciosVendaApi.getAll;
export const getAnuncioVendaById = anunciosVendaApi.getById;
export const createAnuncioVenda = anunciosVendaApi.create;
export const updateAnuncioVenda = anunciosVendaApi.update;
export const deleteAnuncioVenda = anunciosVendaApi.delete;

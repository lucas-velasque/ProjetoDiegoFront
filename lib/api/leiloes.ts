import { apiClient } from './client';
import {
  Leilao,
  CreateLeilaoDto,
  UpdateLeilaoDto,
  FiltroLeilaoDto,
  PaginatedResponse,
} from '@/types';

export const leiloesApi = {
  getAll: async (filtros: FiltroLeilaoDto = {}) => {
    const response = await apiClient.get<PaginatedResponse<Leilao>>(
      '/leiloes',
      { params: filtros }
    );
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<{ data: Leilao }>(
      `/leiloes/${id}`
    );
    return response.data.data;
  },

  create: async (data: CreateLeilaoDto) => {
    const response = await apiClient.post<{ data: Leilao; message: string }>(
      '/leiloes',
      data
    );
    return response.data.data;
  },

  update: async (id: number, data: UpdateLeilaoDto) => {
    const response = await apiClient.patch<{ data: Leilao; message: string }>(
      `/leiloes/${id}`,
      data
    );
    return response.data.data;
  },

  darLance: async (id: number, valor: number) => {
    const response = await apiClient.post<{ data: Leilao; message: string }>(
      `/leiloes/${id}/lance`,
      { valor }
    );
    return response.data.data;
  },

  encerrar: async (id: number) => {
    const response = await apiClient.post<{ data: Leilao; message: string }>(
      `/leiloes/${id}/encerrar`
    );
    return response.data.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete<{ message: string }>(
      `/leiloes/${id}`
    );
    return response.data;
  },
};

import { apiClient } from './client';
import {
  Carta,
  CreateCartaDto,
  UpdateCartaDto,
  FiltroCartaDto,
  PaginatedResponse,
} from '@/types';

export const cartasApi = {
  getAll: async (filtros: FiltroCartaDto = {}) => {
    const response = await apiClient.get<PaginatedResponse<Carta>>(
      '/cartas',
      { params: filtros }
    );
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<{ data: Carta }>(
      `/cartas/${id}`
    );
    return response.data.data;
  },

  create: async (data: CreateCartaDto) => {
    const response = await apiClient.post<{ data: Carta; message: string }>(
      '/cartas',
      data
    );
    return response.data.data;
  },

  update: async (id: number, data: UpdateCartaDto) => {
    const response = await apiClient.patch<{ data: Carta; message: string }>(
      `/cartas/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete<{ message: string }>(
      `/cartas/${id}`
    );
    return response.data;
  },
};

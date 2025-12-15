import { apiClient } from './client';
import {
  CategoriaCartas,
  CreateCategoriaCartasDto,
  UpdateCategoriaCartasDto,
} from '@/types';

export const categoriaCartasApi = {
  getAll: async () => {
    const response = await apiClient.get<{ data: CategoriaCartas[] }>(
      '/categoria-cartas'
    );
    return response.data.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<{ data: CategoriaCartas }>(
      `/categoria-cartas/${id}`
    );
    return response.data.data;
  },

  create: async (data: CreateCategoriaCartasDto) => {
    const response = await apiClient.post<{ data: CategoriaCartas; message: string }>(
      '/categoria-cartas',
      data
    );
    return response.data.data;
  },

  update: async (id: number, data: UpdateCategoriaCartasDto) => {
    const response = await apiClient.patch<{ data: CategoriaCartas; message: string }>(
      `/categoria-cartas/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete<{ message: string }>(
      `/categoria-cartas/${id}`
    );
    return response.data;
  },
};

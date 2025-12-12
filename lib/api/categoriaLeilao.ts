import { apiClient } from './client';
import {
  CategoriaLeilao,
  CreateCategoriaLeilaoDto,
  UpdateCategoriaLeilaoDto,
} from '@/types';

export const categoriaLeilaoApi = {
  getAll: async () => {
    const response = await apiClient.get<{ data: CategoriaLeilao[] }>(
      '/categoria-leilao'
    );
    return response.data.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<{ data: CategoriaLeilao }>(
      `/categoria-leilao/${id}`
    );
    return response.data.data;
  },

  create: async (data: CreateCategoriaLeilaoDto) => {
    const response = await apiClient.post<{ data: CategoriaLeilao; message: string }>(
      '/categoria-leilao',
      data
    );
    return response.data.data;
  },

  update: async (id: number, data: UpdateCategoriaLeilaoDto) => {
    const response = await apiClient.patch<{ data: CategoriaLeilao; message: string }>(
      `/categoria-leilao/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete<{ message: string }>(
      `/categoria-leilao/${id}`
    );
    return response.data;
  },
};

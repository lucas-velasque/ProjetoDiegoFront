import { apiClient } from './client';
import {
  Comentario,
  CreateComentarioDto,
  UpdateComentarioDto,
  FiltroComentarioDto,
  PaginatedResponse,
} from '@/types';

export const comentariosApi = {
  getAll: async (filtros: FiltroComentarioDto = {}) => {
    const response = await apiClient.get<PaginatedResponse<Comentario>>(
      '/comentarios',
      { params: filtros }
    );
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<{ data: Comentario }>(
      `/comentarios/${id}`
    );
    return response.data.data;
  },

  getByEntity: async (entityId: number, entityType: string) => {
    const response = await apiClient.get<{ data: Comentario[] }>(
      `/comentarios/entity/${entityType}/${entityId}`
    );
    return response.data.data;
  },

  create: async (data: CreateComentarioDto) => {
    const response = await apiClient.post<{ data: Comentario; message: string }>(
      '/comentarios',
      data
    );
    return response.data.data;
  },

  update: async (id: number, data: UpdateComentarioDto) => {
    const response = await apiClient.patch<{ data: Comentario; message: string }>(
      `/comentarios/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete<{ message: string }>(
      `/comentarios/${id}`
    );
    return response.data;
  },
};

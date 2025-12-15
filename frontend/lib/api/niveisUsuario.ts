import { apiClient } from './client';
import { NivelUsuario, CreateNivelUsuarioDto, UpdateNivelUsuarioDto } from '@/types';

export const niveisUsuarioApi = {
  getAll: async () => {
    const response = await apiClient.get<{ data: NivelUsuario[] }>(
      '/niveis-usuario'
    );
    return response.data.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<{ data: NivelUsuario }>(
      `/niveis-usuario/${id}`
    );
    return response.data.data;
  },

  create: async (data: CreateNivelUsuarioDto) => {
    const response = await apiClient.post<{ data: NivelUsuario; message: string }>(
      '/niveis-usuario',
      data
    );
    return response.data.data;
  },

  update: async (id: number, data: UpdateNivelUsuarioDto) => {
    const response = await apiClient.patch<{ data: NivelUsuario; message: string }>(
      `/niveis-usuario/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete<{ message: string }>(
      `/niveis-usuario/${id}`
    );
    return response.data;
  },
};

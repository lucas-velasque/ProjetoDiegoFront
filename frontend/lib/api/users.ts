import { apiClient } from './client';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  FiltroUserDto,
  PaginatedResponse,
} from '@/types';

export const usersApi = {
  getAll: async (filtros: FiltroUserDto = {}) => {
    const response = await apiClient.get<PaginatedResponse<User>>(
      '/users',
      { params: filtros }
    );
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<{ data: User }>(
      `/users/${id}`
    );
    return response.data.data;
  },

  create: async (data: CreateUserDto) => {
    const response = await apiClient.post<{ data: User; message: string }>(
      '/users',
      data
    );
    return response.data.data;
  },

  update: async (id: number, data: UpdateUserDto) => {
    const response = await apiClient.patch<{ data: User; message: string }>(
      `/users/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete<{ message: string }>(
      `/users/${id}`
    );
    return response.data;
  },
};

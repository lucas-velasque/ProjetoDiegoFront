import { apiClient } from './client';
import { LoginDto, LoginResponse, CreateUserDto, User } from '@/types';

export const authApi = {
  login: async (data: LoginDto) => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    // Salvar token no localStorage
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  register: async (data: CreateUserDto) => {
    const response = await apiClient.post<{ data: User; message: string }>(
      '/users',
      data
    );
    return response.data.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getProfile: async () => {
    const response = await apiClient.get<{ data: User }>('/auth/profile');
    return response.data.data;
  },
};

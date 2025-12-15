import { apiClient } from './client';
import {
  AnuncioCompra,
  CreateAnuncioCompraDto,
  UpdateAnuncioCompraDto,
  FiltroAnuncioCompraDto,
  PaginatedResponse,
} from '@/types';

export const anunciosCompraApi = {
  getAll: async (filtros: FiltroAnuncioCompraDto = {}) => {
    const response = await apiClient.get<PaginatedResponse<AnuncioCompra>>(
      '/anuncios-compra',
      { params: filtros }
    );
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<{ data: AnuncioCompra }>(
      `/anuncios-compra/${id}`
    );
    return response.data.data;
  },

  create: async (data: CreateAnuncioCompraDto) => {
    const response = await apiClient.post<{ data: AnuncioCompra; message: string }>(
      '/anuncios-compra',
      data
    );
    return response.data.data;
  },

  update: async (id: number, data: UpdateAnuncioCompraDto) => {
    const response = await apiClient.patch<{ data: AnuncioCompra; message: string }>(
      `/anuncios-compra/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete<{ message: string }>(
      `/anuncios-compra/${id}`
    );
    return response.data;
  },
};

export const getAnunciosCompra = anunciosCompraApi.getAll;
export const getAnuncioCompraById = anunciosCompraApi.getById;
export const createAnuncioCompra = anunciosCompraApi.create;
export const updateAnuncioCompra = anunciosCompraApi.update;
export const deleteAnuncioCompra = anunciosCompraApi.delete;

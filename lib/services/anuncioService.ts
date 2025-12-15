import { anunciosVendaApi } from '@/lib/api/anunciosVenda';
import {
  AnuncioVenda,
  CreateAnuncioVendaDto,
  UpdateAnuncioVendaDto,
  FiltroAnuncioVendaDto,
} from '@/types';
import { toast } from 'sonner';

export const anuncioService = {
  getAllAnuncios: async (filtros: FiltroAnuncioVendaDto = {}) => {
    try {
      const data = await anunciosVendaApi.getAll(filtros);
      return data;
    } catch (error) {
      toast.error('Erro ao carregar anúncios');
      throw error;
    }
  },

  getAnuncioById: async (id: number) => {
    try {
      const data = await anunciosVendaApi.getById(id);
      return data;
    } catch (error) {
      toast.error('Erro ao carregar anúncio');
      throw error;
    }
  },

  createAnuncio: async (data: CreateAnuncioVendaDto) => {
    // Validações de negócio
    if (data.preco <= 0) {
      toast.error('Preço deve ser maior que zero');
      throw new Error('Preço inválido');
    }

    if (data.quantidade <= 0) {
      toast.error('Quantidade deve ser maior que zero');
      throw new Error('Quantidade inválida');
    }

    try {
      const anuncio = await anunciosVendaApi.create(data);
      toast.success('Anúncio criado com sucesso!');
      return anuncio;
    } catch (error) {
      toast.error('Erro ao criar anúncio');
      throw error;
    }
  },

  updateAnuncio: async (id: number, data: UpdateAnuncioVendaDto) => {
    // Validações de negócio
    if (data.preco !== undefined && data.preco <= 0) {
      toast.error('Preço deve ser maior que zero');
      throw new Error('Preço inválido');
    }

    if (data.quantidade !== undefined && data.quantidade <= 0) {
      toast.error('Quantidade deve ser maior que zero');
      throw new Error('Quantidade inválida');
    }

    try {
      const anuncio = await anunciosVendaApi.update(id, data);
      toast.success('Anúncio atualizado com sucesso!');
      return anuncio;
    } catch (error) {
      toast.error('Erro ao atualizar anúncio');
      throw error;
    }
  },

  deleteAnuncio: async (id: number) => {
    try {
      await anunciosVendaApi.delete(id);
      toast.success('Anúncio removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover anúncio');
      throw error;
    }
  },

  // Lógica de negócio específica
  calcularTaxaVenda: (preco: number) => {
    return preco * 0.1; // 10% de taxa
  },

  calcularPrecoFinal: (preco: number) => {
    const taxa = anuncioService.calcularTaxaVenda(preco);
    return preco + taxa;
  },
};

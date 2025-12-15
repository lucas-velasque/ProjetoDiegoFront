import { cartasApi } from '@/lib/api/cartas';
import { Carta, CreateCartaDto, UpdateCartaDto, FiltroCartaDto } from '@/types';
import { toast } from 'sonner';

export const cartaService = {
  getAllCartas: async (filtros: FiltroCartaDto = {}) => {
    try {
      const data = await cartasApi.getAll(filtros);
      return data;
    } catch (error) {
      toast.error('Erro ao carregar cartas');
      throw error;
    }
  },

  getCartaById: async (id: number) => {
    try {
      const data = await cartasApi.getById(id);
      return data;
    } catch (error) {
      toast.error('Erro ao carregar carta');
      throw error;
    }
  },

  createCarta: async (data: CreateCartaDto) => {
    // Validações de negócio
    if (!data.nome || data.nome.trim() === '') {
      toast.error('Nome da carta é obrigatório');
      throw new Error('Nome inválido');
    }

    if (data.pontos_ataque !== undefined && data.pontos_ataque < 0) {
      toast.error('Pontos de ataque não podem ser negativos');
      throw new Error('Pontos de ataque inválidos');
    }

    if (data.pontos_saude !== undefined && data.pontos_saude < 0) {
      toast.error('Pontos de saúde não podem ser negativos');
      throw new Error('Pontos de saúde inválidos');
    }

    try {
      const carta = await cartasApi.create(data);
      toast.success('Carta criada com sucesso!');
      return carta;
    } catch (error) {
      toast.error('Erro ao criar carta');
      throw error;
    }
  },

  updateCarta: async (id: number, data: UpdateCartaDto) => {
    // Validações de negócio
    if (data.pontos_ataque !== undefined && data.pontos_ataque < 0) {
      toast.error('Pontos de ataque não podem ser negativos');
      throw new Error('Pontos de ataque inválidos');
    }

    if (data.pontos_saude !== undefined && data.pontos_saude < 0) {
      toast.error('Pontos de saúde não podem ser negativos');
      throw new Error('Pontos de saúde inválidos');
    }

    try {
      const carta = await cartasApi.update(id, data);
      toast.success('Carta atualizada com sucesso!');
      return carta;
    } catch (error) {
      toast.error('Erro ao atualizar carta');
      throw error;
    }
  },

  deleteCarta: async (id: number) => {
    try {
      await cartasApi.delete(id);
      toast.success('Carta removida com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover carta');
      throw error;
    }
  },
};

import { propostasApi } from '@/lib/api/propostas';
import {
  Proposta,
  CreatePropostaDto,
  UpdatePropostaDto,
  FiltroPropostaDto,
} from '@/types';
import { toast } from 'sonner';

export const propostaService = {
  getAllPropostas: async (filtros: FiltroPropostaDto = {}) => {
    try {
      const data = await propostasApi.getAll(filtros);
      return data;
    } catch (error) {
      toast.error('Erro ao carregar propostas');
      throw error;
    }
  },

  getPropostaById: async (id: number) => {
    try {
      const data = await propostasApi.getById(id);
      return data;
    } catch (error) {
      toast.error('Erro ao carregar proposta');
      throw error;
    }
  },

  getPropostasByAnuncio: async (anuncioId: number, filtros: FiltroPropostaDto = {}) => {
    try {
      const data = await propostasApi.getByAnuncio(anuncioId, filtros);
      return data;
    } catch (error) {
      toast.error('Erro ao carregar propostas do anúncio');
      throw error;
    }
  },

  createProposta: async (data: CreatePropostaDto) => {
    // Validações de negócio
    if (data.valor_oferta <= 0) {
      toast.error('Valor da proposta deve ser maior que zero');
      throw new Error('Valor inválido');
    }

    try {
      const proposta = await propostasApi.create(data);
      toast.success('Proposta enviada com sucesso!');
      return proposta;
    } catch (error) {
      toast.error('Erro ao enviar proposta');
      throw error;
    }
  },

  updateProposta: async (id: number, data: UpdatePropostaDto) => {
    // Validações de negócio
    if (data.valor_oferta !== undefined && data.valor_oferta <= 0) {
      toast.error('Valor da proposta deve ser maior que zero');
      throw new Error('Valor inválido');
    }

    try {
      const proposta = await propostasApi.update(id, data);
      toast.success('Proposta atualizada com sucesso!');
      return proposta;
    } catch (error) {
      toast.error('Erro ao atualizar proposta');
      throw error;
    }
  },

  acceptProposta: async (id: number) => {
    try {
      const proposta = await propostasApi.accept(id);
      toast.success('Proposta aceita com sucesso!');
      return proposta;
    } catch (error) {
      toast.error('Erro ao aceitar proposta');
      throw error;
    }
  },

  rejectProposta: async (id: number) => {
    try {
      const proposta = await propostasApi.reject(id);
      toast.success('Proposta recusada');
      return proposta;
    } catch (error) {
      toast.error('Erro ao recusar proposta');
      throw error;
    }
  },

  deleteProposta: async (id: number) => {
    try {
      await propostasApi.delete(id);
      toast.success('Proposta removida com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover proposta');
      throw error;
    }
  },
};

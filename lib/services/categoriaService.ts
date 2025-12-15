import { categoriaCartasApi } from '@/lib/api/categoriaCartas';
import { categoriaLeilaoApi } from '@/lib/api/categoriaLeilao';
import { niveisUsuarioApi } from '@/lib/api/niveisUsuario';
import {
  CategoriaCartas,
  CreateCategoriaCartasDto,
  UpdateCategoriaCartasDto,
  CategoriaLeilao,
  CreateCategoriaLeilaoDto,
  UpdateCategoriaLeilaoDto,
  NivelUsuario,
  CreateNivelUsuarioDto,
  UpdateNivelUsuarioDto,
} from '@/types';
import { toast } from 'sonner';

export const categoriaCartaService = {
  getAll: async () => {
    try {
      const data = await categoriaCartasApi.getAll();
      return data;
    } catch (error) {
      toast.error('Erro ao carregar categorias de cartas');
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      const data = await categoriaCartasApi.getById(id);
      return data;
    } catch (error) {
      toast.error('Erro ao carregar categoria');
      throw error;
    }
  },

  create: async (data: CreateCategoriaCartasDto) => {
    if (!data.nome || data.nome.trim() === '') {
      toast.error('Nome da categoria é obrigatório');
      throw new Error('Nome inválido');
    }

    try {
      const categoria = await categoriaCartasApi.create(data);
      toast.success('Categoria criada com sucesso!');
      return categoria;
    } catch (error) {
      toast.error('Erro ao criar categoria');
      throw error;
    }
  },

  update: async (id: number, data: UpdateCategoriaCartasDto) => {
    try {
      const categoria = await categoriaCartasApi.update(id, data);
      toast.success('Categoria atualizada com sucesso!');
      return categoria;
    } catch (error) {
      toast.error('Erro ao atualizar categoria');
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      await categoriaCartasApi.delete(id);
      toast.success('Categoria removida com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover categoria');
      throw error;
    }
  },
};

export const categoriaLeilaoService = {
  getAll: async () => {
    try {
      const data = await categoriaLeilaoApi.getAll();
      return data;
    } catch (error) {
      toast.error('Erro ao carregar categorias de leilão');
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      const data = await categoriaLeilaoApi.getById(id);
      return data;
    } catch (error) {
      toast.error('Erro ao carregar categoria');
      throw error;
    }
  },

  create: async (data: CreateCategoriaLeilaoDto) => {
    if (!data.nome || data.nome.trim() === '') {
      toast.error('Nome da categoria é obrigatório');
      throw new Error('Nome inválido');
    }

    try {
      const categoria = await categoriaLeilaoApi.create(data);
      toast.success('Categoria criada com sucesso!');
      return categoria;
    } catch (error) {
      toast.error('Erro ao criar categoria');
      throw error;
    }
  },

  update: async (id: number, data: UpdateCategoriaLeilaoDto) => {
    try {
      const categoria = await categoriaLeilaoApi.update(id, data);
      toast.success('Categoria atualizada com sucesso!');
      return categoria;
    } catch (error) {
      toast.error('Erro ao atualizar categoria');
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      await categoriaLeilaoApi.delete(id);
      toast.success('Categoria removida com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover categoria');
      throw error;
    }
  },
};

export const nivelUsuarioService = {
  getAll: async () => {
    try {
      const data = await niveisUsuarioApi.getAll();
      return data;
    } catch (error) {
      toast.error('Erro ao carregar níveis de usuário');
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      const data = await niveisUsuarioApi.getById(id);
      return data;
    } catch (error) {
      toast.error('Erro ao carregar nível');
      throw error;
    }
  },

  create: async (data: CreateNivelUsuarioDto) => {
    if (!data.nome || data.nome.trim() === '') {
      toast.error('Nome do nível é obrigatório');
      throw new Error('Nome inválido');
    }

    try {
      const nivel = await niveisUsuarioApi.create(data);
      toast.success('Nível criado com sucesso!');
      return nivel;
    } catch (error) {
      toast.error('Erro ao criar nível');
      throw error;
    }
  },

  update: async (id: number, data: UpdateNivelUsuarioDto) => {
    try {
      const nivel = await niveisUsuarioApi.update(id, data);
      toast.success('Nível atualizado com sucesso!');
      return nivel;
    } catch (error) {
      toast.error('Erro ao atualizar nível');
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      await niveisUsuarioApi.delete(id);
      toast.success('Nível removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover nível');
      throw error;
    }
  },
};

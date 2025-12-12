import { useState, useEffect } from 'react';
import {
  categoriaCartaService,
  categoriaLeilaoService,
  nivelUsuarioService,
} from '@/lib/services/categoriaService';
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

export const useCategoriasCartas = () => {
  const [categorias, setCategorias] = useState<CategoriaCartas[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoriaCartaService.getAll();
      setCategorias(data);
    } catch (err) {
      setError('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const createCategoria = async (data: CreateCategoriaCartasDto) => {
    setLoading(true);
    try {
      await categoriaCartaService.create(data);
      await fetchCategorias();
    } finally {
      setLoading(false);
    }
  };

  const updateCategoria = async (id: number, data: UpdateCategoriaCartasDto) => {
    setLoading(true);
    try {
      await categoriaCartaService.update(id, data);
      await fetchCategorias();
    } finally {
      setLoading(false);
    }
  };

  const deleteCategoria = async (id: number) => {
    setLoading(true);
    try {
      await categoriaCartaService.delete(id);
      await fetchCategorias();
    } finally {
      setLoading(false);
    }
  };

  return {
    categorias,
    loading,
    error,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    refetch: fetchCategorias,
  };
};

export const useCategoriasLeilao = () => {
  const [categorias, setCategorias] = useState<CategoriaLeilao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoriaLeilaoService.getAll();
      setCategorias(data);
    } catch (err) {
      setError('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const createCategoria = async (data: CreateCategoriaLeilaoDto) => {
    setLoading(true);
    try {
      await categoriaLeilaoService.create(data);
      await fetchCategorias();
    } finally {
      setLoading(false);
    }
  };

  const updateCategoria = async (id: number, data: UpdateCategoriaLeilaoDto) => {
    setLoading(true);
    try {
      await categoriaLeilaoService.update(id, data);
      await fetchCategorias();
    } finally {
      setLoading(false);
    }
  };

  const deleteCategoria = async (id: number) => {
    setLoading(true);
    try {
      await categoriaLeilaoService.delete(id);
      await fetchCategorias();
    } finally {
      setLoading(false);
    }
  };

  return {
    categorias,
    loading,
    error,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    refetch: fetchCategorias,
  };
};

export const useNiveisUsuario = () => {
  const [niveis, setNiveis] = useState<NivelUsuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNiveis = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await nivelUsuarioService.getAll();
      setNiveis(data);
    } catch (err) {
      setError('Erro ao carregar níveis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNiveis();
  }, []);

  const createNivel = async (data: CreateNivelUsuarioDto) => {
    setLoading(true);
    try {
      await nivelUsuarioService.create(data);
      await fetchNiveis();
    } finally {
      setLoading(false);
    }
  };

  const updateNivel = async (id: number, data: UpdateNivelUsuarioDto) => {
    setLoading(true);
    try {
      await nivelUsuarioService.update(id, data);
      await fetchNiveis();
    } finally {
      setLoading(false);
    }
  };

  const deleteNivel = async (id: number) => {
    setLoading(true);
    try {
      await nivelUsuarioService.delete(id);
      await fetchNiveis();
    } finally {
      setLoading(false);
    }
  };

  return {
    niveis,
    loading,
    error,
    createNivel,
    updateNivel,
    deleteNivel,
    refetch: fetchNiveis,
  };
};

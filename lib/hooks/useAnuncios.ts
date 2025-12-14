import { useState, useEffect } from 'react';
import { anuncioService } from '@/lib/services/anuncioService';
import {
  AnuncioVenda,
  FiltroAnuncioVendaDto,
  CreateAnuncioVendaDto,
  UpdateAnuncioVendaDto,
  PaginatedResponse,
} from '@/types';

export const useAnuncios = (filtrosIniciais: FiltroAnuncioVendaDto = {}) => {
  const [anuncios, setAnuncios] = useState<AnuncioVenda[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltroAnuncioVendaDto>(filtrosIniciais);

  const fetchAnuncios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await anuncioService.getAllAnuncios(filtros);
      setAnuncios(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError('Erro ao carregar anúncios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnuncios();
  }, [filtros]);

  const createAnuncio = async (data: CreateAnuncioVendaDto) => {
    setLoading(true);
    try {
      await anuncioService.createAnuncio(data);
      await fetchAnuncios();
    } finally {
      setLoading(false);
    }
  };

  const updateAnuncio = async (id: number, data: UpdateAnuncioVendaDto) => {
    setLoading(true);
    try {
      await anuncioService.updateAnuncio(id, data);
      await fetchAnuncios();
    } finally {
      setLoading(false);
    }
  };

  const deleteAnuncio = async (id: number) => {
    setLoading(true);
    try {
      await anuncioService.deleteAnuncio(id);
      await fetchAnuncios();
    } finally {
      setLoading(false);
    }
  };

  const atualizarFiltros = (novosFiltros: Partial<FiltroAnuncioVendaDto>) => {
    setFiltros((prev) => ({ ...prev, ...novosFiltros }));
  };

  const mudarPagina = (novaPagina: number) => {
    setFiltros((prev) => ({ ...prev, page: novaPagina }));
  };

  const limparFiltros = () => {
    setFiltros(filtrosIniciais);
  };

  return {
    anuncios,
    meta,
    loading,
    error,
    filtros,
    createAnuncio,
    updateAnuncio,
    deleteAnuncio,
    atualizarFiltros,
    mudarPagina,
    limparFiltros,
    refetch: fetchAnuncios,
  };
};

export const useAnuncio = (id: number) => {
  const [anuncio, setAnuncio] = useState<AnuncioVenda | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnuncio = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const data = await anuncioService.getAnuncioById(id);
      setAnuncio(data);
    } catch (err) {
      setError('Erro ao carregar anúncio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnuncio();
  }, [id]);

  return {
    anuncio,
    loading,
    error,
    refetch: fetchAnuncio,
  };
};

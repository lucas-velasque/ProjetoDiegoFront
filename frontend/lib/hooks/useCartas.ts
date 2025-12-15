import { useState, useEffect } from 'react';
import { cartaService } from '@/lib/services/cartaService';
import {
  Carta,
  FiltroCartaDto,
  CreateCartaDto,
  UpdateCartaDto,
  PaginatedResponse,
} from '@/types';

export const useCartas = (filtrosIniciais: FiltroCartaDto = {}) => {
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltroCartaDto>(filtrosIniciais);

  const fetchCartas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartaService.getAllCartas(filtros);
      setCartas(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError('Erro ao carregar cartas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartas();
  }, [filtros]);

  const createCarta = async (data: CreateCartaDto) => {
    setLoading(true);
    try {
      await cartaService.createCarta(data);
      await fetchCartas();
    } finally {
      setLoading(false);
    }
  };

  const updateCarta = async (id: number, data: UpdateCartaDto) => {
    setLoading(true);
    try {
      await cartaService.updateCarta(id, data);
      await fetchCartas();
    } finally {
      setLoading(false);
    }
  };

  const deleteCarta = async (id: number) => {
    setLoading(true);
    try {
      await cartaService.deleteCarta(id);
      await fetchCartas();
    } finally {
      setLoading(false);
    }
  };

  const atualizarFiltros = (novosFiltros: Partial<FiltroCartaDto>) => {
    setFiltros((prev) => ({ ...prev, ...novosFiltros }));
  };

  const mudarPagina = (novaPagina: number) => {
    setFiltros((prev) => ({ ...prev, page: novaPagina }));
  };

  const limparFiltros = () => {
    setFiltros(filtrosIniciais);
  };

  return {
    cartas,
    meta,
    loading,
    error,
    filtros,
    createCarta,
    updateCarta,
    deleteCarta,
    atualizarFiltros,
    mudarPagina,
    limparFiltros,
    refetch: fetchCartas,
  };
};

export const useCarta = (id: number) => {
  const [carta, setCarta] = useState<Carta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCarta = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const data = await cartaService.getCartaById(id);
      setCarta(data);
    } catch (err) {
      setError('Erro ao carregar carta');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarta();
  }, [id]);

  return {
    carta,
    loading,
    error,
    refetch: fetchCarta,
  };
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Types
interface AnuncioVendaCarta {
  carta_id: number;
  quantidade: number;
  condicao?: string;
  observacoes?: string;
}

interface CreateAnuncioVendaDto {
  titulo: string;
  descricao?: string;
  preco_total: number;
  quantidade_disponivel: number;
  cartas: AnuncioVendaCarta[];
}

interface UpdateAnuncioVendaDto {
  titulo?: string;
  descricao?: string;
  preco_total?: number;
  quantidade_disponivel?: number;
  status?: 'ativo' | 'vendido' | 'cancelado';
}

interface FiltroAnuncioVenda {
  preco_min?: number;
  preco_max?: number;
  nome_carta?: string;
  condicao?: string;
  raridade?: string;
  status?: 'ativo' | 'vendido' | 'cancelado';
  data_inicio?: string;
  data_fim?: string;
  page?: number;
  limit?: number;
}

interface AnuncioVenda {
  id: number;
  usuario_id: number;
  titulo: string;
  descricao?: string;
  preco_total: number;
  quantidade_disponivel: number;
  status: 'ativo' | 'vendido' | 'cancelado';
  created_at: Date;
  updated_at: Date;
  cartas: Array<{
    carta_id: number;
    quantidade: number;
    condicao?: string;
    observacoes?: string;
  }>;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Cliente API para gerenciar anúncios de venda
 */

/**
 * Criar novo anúncio de venda
<<<<<<< HEAD
=======
 * @param data - Dados do anúncio
 * @returns Anúncio criado
>>>>>>> bcffeb271a62fe83e6127eb982ded50aab02ba51
 */
export async function createAnuncioVenda(data: CreateAnuncioVendaDto): Promise<AnuncioVenda> {
  try {
    const response = await fetch(`${API_BASE_URL}/anuncios-venda`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar anúncio');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar anúncio:', error);
    throw error;
  }
}

/**
 * Listar todos os anúncios com filtros
<<<<<<< HEAD
=======
 * @param filtros - Filtros opcionais
 * @returns Lista paginada de anúncios ou array simples
>>>>>>> bcffeb271a62fe83e6127eb982ded50aab02ba51
 */
export async function getAnunciosVenda(
  filtros: FiltroAnuncioVenda = {}
): Promise<PaginatedResponse<AnuncioVenda> | AnuncioVenda[]> {
  try {
    const queryParams = new URLSearchParams();

    if (filtros.preco_min !== undefined) queryParams.append('preco_min', filtros.preco_min.toString());
    if (filtros.preco_max !== undefined) queryParams.append('preco_max', filtros.preco_max.toString());
    if (filtros.nome_carta) queryParams.append('nome_carta', filtros.nome_carta);
    if (filtros.condicao) queryParams.append('condicao', filtros.condicao);
    if (filtros.raridade) queryParams.append('raridade', filtros.raridade);
    if (filtros.status) queryParams.append('status', filtros.status);
    if (filtros.data_inicio) queryParams.append('data_inicio', filtros.data_inicio);
    if (filtros.data_fim) queryParams.append('data_fim', filtros.data_fim);
    if (filtros.page) queryParams.append('page', filtros.page.toString());
    if (filtros.limit) queryParams.append('limit', filtros.limit.toString());

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/anuncios-venda${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao buscar anúncios');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar anúncios:', error);
    throw error;
  }
}

/**
 * Buscar anúncio específico por ID
<<<<<<< HEAD
=======
 * @param id - ID do anúncio
 * @returns Anúncio
>>>>>>> bcffeb271a62fe83e6127eb982ded50aab02ba51
 */
export async function getAnuncioVendaById(id: number): Promise<AnuncioVenda> {
  try {
    const response = await fetch(`${API_BASE_URL}/anuncios-venda/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao buscar anúncio');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar anúncio:', error);
    throw error;
  }
}

/**
 * Atualizar anúncio
<<<<<<< HEAD
=======
 * @param id - ID do anúncio
 * @param data - Dados para atualizar
 * @returns Anúncio atualizado
>>>>>>> bcffeb271a62fe83e6127eb982ded50aab02ba51
 */
export async function updateAnuncioVenda(
  id: number,
  data: UpdateAnuncioVendaDto
): Promise<AnuncioVenda> {
  try {
    const response = await fetch(`${API_BASE_URL}/anuncios-venda/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar anúncio');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar anúncio:', error);
    throw error;
  }
}

/**
 * Deletar anúncio
<<<<<<< HEAD
=======
 * @param id - ID do anúncio
 * @returns Resultado da deleção
>>>>>>> bcffeb271a62fe83e6127eb982ded50aab02ba51
 */
export async function deleteAnuncioVenda(id: number): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/anuncios-venda/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao deletar anúncio');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao deletar anúncio:', error);
    throw error;
  }
}

<<<<<<< HEAD
// Exportar tipos
=======
// Exportar tipos para uso em outros arquivos
>>>>>>> bcffeb271a62fe83e6127eb982ded50aab02ba51
export type {
  AnuncioVenda,
  CreateAnuncioVendaDto,
  UpdateAnuncioVendaDto,
  FiltroAnuncioVenda,
  AnuncioVendaCarta,
  PaginatedResponse,
};

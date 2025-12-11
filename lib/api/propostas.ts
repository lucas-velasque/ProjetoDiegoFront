const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface CreatePropostaDto {
  valor_proposto: number;
  mensagem?: string;
}

interface UpdatePropostaDto {
  valor_proposto?: number;
  mensagem?: string;
  status?: 'pendente' | 'aceita' | 'recusada' | 'cancelada';
}

interface Proposta {
  id: number;
  anuncio_tipo: 'venda' | 'compra';
  anuncio_id: number;
  usuario_id: number;
  valor_proposto: number;
  mensagem?: string;
  status: 'pendente' | 'aceita' | 'recusada' | 'cancelada';
  created_at: Date;
  updated_at: Date;
}

interface FiltroPropostas {
  status?: 'pendente' | 'aceita' | 'recusada' | 'cancelada';
  page?: number;
  limit?: number;
}

/**
 * Cliente API para gerenciar propostas
 */

/**
 * Criar nova proposta para um anúncio
 * @param tipo - Tipo do anúncio ('venda' ou 'compra')
 * @param anuncioId - ID do anúncio
 * @param data - Dados da proposta { valor_proposto, mensagem? }
 * @returns Proposta criada
 */
export async function createProposta(
  tipo: 'venda' | 'compra',
  anuncioId: number | string,
  data: CreatePropostaDto
): Promise<Proposta> {
  try {
    const response = await fetch(`${API_BASE_URL}/anuncios/${tipo}/${anuncioId}/propostas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar proposta');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar proposta:', error);
    throw error;
  }
}

/**
 * Listar propostas de um anúncio
 * @param tipo - Tipo do anúncio ('venda' ou 'compra')
 * @param anuncioId - ID do anúncio
 * @param filtros - Filtros opcionais { status?, page?, limit? }
 * @returns Lista de propostas
 */
export async function getPropostasByAnuncio(
  tipo: 'venda' | 'compra',
  anuncioId: number | string,
  filtros: FiltroPropostas = {}
): Promise<Proposta[]> {
  try {
    const queryParams = new URLSearchParams();

    if (filtros.status) queryParams.append('status', filtros.status);
    if (filtros.page) queryParams.append('page', filtros.page.toString());
    if (filtros.limit) queryParams.append('limit', filtros.limit.toString());

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/anuncios/${tipo}/${anuncioId}/propostas${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao buscar propostas');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar propostas:', error);
    throw error;
  }
}

/**
 * Buscar proposta específica por ID
 * @param id - ID da proposta
 * @returns Proposta
 */
export async function getPropostaById(id: number): Promise<Proposta> {
  try {
    const response = await fetch(`${API_BASE_URL}/propostas/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao buscar proposta');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar proposta:', error);
    throw error;
  }
}

/**
 * Aceitar uma proposta
 * @param id - ID da proposta
 * @returns Proposta atualizada
 */
export async function acceptProposta(id: number): Promise<Proposta> {
  try {
    const response = await fetch(`${API_BASE_URL}/propostas/${id}/aceitar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao aceitar proposta');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao aceitar proposta:', error);
    throw error;
  }
}

/**
 * Atualizar uma proposta
 * @param id - ID da proposta
 * @param data - Dados para atualizar { valor_proposto?, mensagem?, status? }
 * @returns Proposta atualizada
 */
export async function updateProposta(id: number, data: UpdatePropostaDto): Promise<Proposta> {
  try {
    const response = await fetch(`${API_BASE_URL}/propostas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar proposta');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar proposta:', error);
    throw error;
  }
}

/**
 * Deletar uma proposta
 * @param id - ID da proposta
 * @returns Resultado da deleção
 */
export async function deleteProposta(id: number): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/propostas/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao deletar proposta');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao deletar proposta:', error);
    throw error;
  }
}

// Exportar tipos para uso em outros arquivos
export type { Proposta, CreatePropostaDto, UpdatePropostaDto, FiltroPropostas };

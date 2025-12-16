import { apiClient } from './client';

export interface AdicionarCarrinhoDto {
  anuncio_venda_id: number;
  quantidade: number;
}

export interface CarrinhoItem {
  id: number;
  usuario_id: number;
  anuncio_venda_id: number;
  quantidade: number;
  created_at: string;
  updated_at: string;
  anuncio?: {
    id: number;
    titulo: string;
    descricao: string;
    preco_total: number;
    quantidade_disponivel: number;
    status: string;
  };
}

export interface CarrinhoResponse {
  itens: CarrinhoItem[];
  resumo: {
    total_itens: number;
    valor_total: number;
  };
}

export const carrinhoApi = {
  // Adicionar item ao carrinho
  async adicionarAoCarrinho(dto: AdicionarCarrinhoDto): Promise<CarrinhoItem> {
    const response = await apiClient.post('/carrinho', dto);
    return response.data;
  },

  // Visualizar carrinho
  async verCarrinho(): Promise<CarrinhoResponse> {
    const response = await apiClient.get('/carrinho');
    return response.data;
  },

  // Remover item do carrinho
  async removerDoCarrinho(itemId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/carrinho/${itemId}`);
    return response.data;
  },

  // Finalizar compra (checkout)
  async checkout(): Promise<any> {
    const response = await apiClient.post('/carrinho/checkout');
    return response.data;
  },
};

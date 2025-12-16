import { carrinhoApi, AdicionarCarrinhoDto, CarrinhoResponse } from '../api/carrinho';

class CarrinhoService {
  async adicionarAoCarrinho(anuncioVendaId: number, quantidade: number = 1) {
    try {
      const dto: AdicionarCarrinhoDto = {
        anuncio_venda_id: anuncioVendaId,
        quantidade,
      };
      const result = await carrinhoApi.adicionarAoCarrinho(dto);
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Erro ao adicionar ao carrinho:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao adicionar ao carrinho',
      };
    }
  }

  async verCarrinho(): Promise<{ success: boolean; data?: CarrinhoResponse; error?: string }> {
    try {
      const result = await carrinhoApi.verCarrinho();
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Erro ao buscar carrinho:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao buscar carrinho',
      };
    }
  }

  async removerDoCarrinho(itemId: number) {
    try {
      const result = await carrinhoApi.removerDoCarrinho(itemId);
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Erro ao remover do carrinho:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao remover do carrinho',
      };
    }
  }

  async checkout() {
    try {
      const result = await carrinhoApi.checkout();
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Erro ao finalizar compra:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao finalizar compra',
      };
    }
  }
}

export const carrinhoService = new CarrinhoService();

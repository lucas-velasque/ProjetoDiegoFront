import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { carrinhoService } from '@/lib/services/carrinhoService';
import { CarrinhoResponse, CarrinhoItem } from '@/lib/api/carrinho';

interface CartState {
  items: CarrinhoItem[];
  totalItens: number;
  valorTotal: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalItens: 0,
  valorTotal: 0,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCarrinho = createAsyncThunk(
  'cart/fetchCarrinho',
  async (_, { rejectWithValue }) => {
    const result = await carrinhoService.verCarrinho();
    if (result.success && result.data) {
      return result.data;
    }
    return rejectWithValue(result.error || 'Erro ao buscar carrinho');
  }
);

export const adicionarAoCarrinho = createAsyncThunk(
  'cart/adicionarAoCarrinho',
  async ({ anuncioVendaId, quantidade = 1 }: { anuncioVendaId: number; quantidade?: number }, { rejectWithValue }) => {
    const result = await carrinhoService.adicionarAoCarrinho(anuncioVendaId, quantidade);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error || 'Erro ao adicionar ao carrinho');
  }
);

export const removerDoCarrinho = createAsyncThunk(
  'cart/removerDoCarrinho',
  async (itemId: number, { rejectWithValue }) => {
    const result = await carrinhoService.removerDoCarrinho(itemId);
    if (result.success) {
      return itemId;
    }
    return rejectWithValue(result.error || 'Erro ao remover do carrinho');
  }
);

export const finalizarCompra = createAsyncThunk(
  'cart/finalizarCompra',
  async (_, { rejectWithValue }) => {
    const result = await carrinhoService.checkout();
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error || 'Erro ao finalizar compra');
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItens = 0;
      state.valorTotal = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch Carrinho
    builder
      .addCase(fetchCarrinho.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarrinho.fulfilled, (state, action: PayloadAction<CarrinhoResponse>) => {
        state.loading = false;
        state.items = action.payload.itens;
        state.totalItens = action.payload.resumo.total_itens;
        state.valorTotal = action.payload.resumo.valor_total;
      })
      .addCase(fetchCarrinho.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Adicionar ao Carrinho
    builder
      .addCase(adicionarAoCarrinho.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adicionarAoCarrinho.fulfilled, (state) => {
        state.loading = false;
        // Depois de adicionar, vamos buscar o carrinho atualizado
      })
      .addCase(adicionarAoCarrinho.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Remover do Carrinho
    builder
      .addCase(removerDoCarrinho.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removerDoCarrinho.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.totalItens = state.items.length;
        state.valorTotal = state.items.reduce((total, item) => {
          if (item.anuncio) {
            return total + (item.quantidade * Number(item.anuncio.preco_total));
          }
          return total;
        }, 0);
      })
      .addCase(removerDoCarrinho.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Finalizar Compra
    builder
      .addCase(finalizarCompra.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(finalizarCompra.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalItens = 0;
        state.valorTotal = 0;
      })
      .addCase(finalizarCompra.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

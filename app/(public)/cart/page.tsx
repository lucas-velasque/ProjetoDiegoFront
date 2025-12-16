"use client";
import PageTitle from "@/components/PageTitle";
import { fetchCarrinho, removerDoCarrinho } from "@/lib/features/cart/cartSlice";
import { Trash2Icon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";

export default function Cart() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "R$";

  const dispatch = useDispatch<AppDispatch>();
  const { items, valorTotal, totalItens, loading, error } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    // Carregar carrinho ao montar o componente
    dispatch(fetchCarrinho());
  }, [dispatch]);

  const handleRemoveFromCart = async (itemId: number) => {
    await dispatch(removerDoCarrinho(itemId));
  };

  if (loading && items.length === 0) {
    return (
      <div className="min-h-[80vh] mx-6 flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] mx-6 flex flex-col items-center justify-center text-red-500">
        <h1 className="text-2xl font-semibold mb-2">Erro ao carregar carrinho</h1>
        <p>{error}</p>
      </div>
    );
  }

  return items.length > 0 ? (
    <div className="min-h-screen mx-6 text-slate-800">
      <div className="max-w-7xl mx-auto">
        <PageTitle
          heading="Carrinho"
          linkText="Adicionar mais produtos"
          linkHref="/shop"
        />

        <div className="flex items-start justify-between gap-5 max-lg:flex-col">
          <table className="w-full max-w-4xl text-slate-600 table-auto">
            <thead>
              <tr className="max-sm:text-sm">
                <th className="text-left">Produto</th>
                <th className="text-center">Quantidade</th>
                <th className="text-center">Total</th>
                <th className="text-center max-md:hidden">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-4">
                    <div className="flex gap-3 items-center">
                      <div className="flex gap-3 items-center justify-center bg-slate-100 size-18 rounded-md p-2">
                        {item.anuncio ? (
                          <div className="text-xs text-center">
                            <p className="font-semibold">{item.anuncio.titulo}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-red-500">Anúncio não disponível</p>
                        )}
                      </div>
                      <div>
                        <p className="max-sm:text-sm font-medium">
                          {item.anuncio?.titulo || 'Item removido'}
                        </p>
                        {item.anuncio && (
                          <>
                            <p className="text-xs text-slate-500 line-clamp-1">
                              {item.anuncio.descricao}
                            </p>
                            <p className="text-sm font-semibold mt-1">
                              {currency} {Number(item.anuncio.preco_total).toFixed(2)}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="px-4 py-2 bg-slate-100 rounded-md">
                      {item.quantidade}
                    </span>
                  </td>
                  <td className="text-center font-semibold">
                    {item.anuncio ? (
                      <>
                        {currency} {(Number(item.anuncio.preco_total) * item.quantidade).toFixed(2)}
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="text-center max-md:hidden">
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      disabled={loading}
                      className="text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all disabled:opacity-50"
                    >
                      <Trash2Icon size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="lg:sticky lg:top-24 w-full lg:max-w-sm bg-slate-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Total de itens:</span>
                <span className="font-semibold">{totalItens}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>{currency} {valorTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => {
                // TODO: Implementar checkout
                alert('Checkout em desenvolvimento');
              }}
            >
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
      <h1 className="text-2xl sm:text-4xl font-semibold">
        Seu carrinho está vazio
      </h1>
    </div>
  );
}

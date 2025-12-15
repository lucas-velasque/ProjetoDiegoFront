'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import PageTitle from '@/components/PageTitle';
import StripePaymentForm from '@/components/StripePaymentForm';
import { StripeProvider } from '@/lib/stripe/stripe-provider';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clientSecret, setClientSecret] = useState(null);
  const [pedidoId, setPedidoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'R$';

  // Obter ID do pedido da URL
  useEffect(() => {
    const id = searchParams.get('pedidoId');
    if (!id) {
      setError('ID do pedido não fornecido');
      setLoading(false);
      return;
    }

    setPedidoId(parseInt(id));
    criarPaymentIntent(parseInt(id));
  }, [searchParams]);

  const criarPaymentIntent = async (id) => {
    try {
      setLoading(true);

      // Buscar dados do pedido
      const pedidoResponse = await fetch(`/api/pedidos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!pedidoResponse.ok) {
        throw new Error('Erro ao buscar dados do pedido');
      }

      const pedido = await pedidoResponse.json();
      setOrderData(pedido);

      // Criar Payment Intent
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pagamento/payment-intent/${id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            valor: pedido.valor_total,
            descricao: `Pagamento do Pedido #${id}`,
            email: localStorage.getItem('userEmail'),
            nome: localStorage.getItem('userName'),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar Payment Intent');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setLoading(false);
    } catch (err) {
      console.error('Erro:', err);
      setError(err.message);
      setLoading(false);
      toast.error(`Erro: ${err.message}`);
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    toast.success('Pagamento confirmado com sucesso!');
    // Redirecionar para página de confirmação
    router.push(`/pedidos/${pedidoId}?payment=success`);
  };

  const handlePaymentError = (error) => {
    console.error('Erro no pagamento:', error);
    toast.error(`Erro no pagamento: ${error.message}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando formulário de pagamento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mx-6">
        <div className="max-w-7xl mx-auto">
          <PageTitle heading="Erro no Checkout" />
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
            <h2 className="text-xl font-semibold mb-2">Erro ao processar checkout</h2>
            <p>{error}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-6 text-slate-800">
      <div className="max-w-2xl mx-auto">
        <PageTitle heading="Checkout - Pagamento Seguro" />

        {orderData && (
          <div className="mb-8 bg-slate-50 border border-slate-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Pedido #:</span>
                <span className="font-medium">{pedidoId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total:</span>
                <span className="font-medium text-lg">
                  {currency} {orderData.valor_total?.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Status:</span>
                <span className="font-medium capitalize">{orderData.status}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-lg p-8">
          <h2 className="text-lg font-semibold mb-6">Informações de Pagamento</h2>

          {clientSecret ? (
            <StripeProvider>
              <StripePaymentForm
                clientSecret={clientSecret}
                pedidoId={pedidoId}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </StripeProvider>
          ) : (
            <div className="text-center text-slate-600">
              <p>Carregando formulário de pagamento...</p>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <p className="font-semibold mb-2">🔒 Pagamento Seguro</p>
          <p>
            Seu pagamento é processado de forma segura pelo Stripe. Seus dados de
            cartão nunca são armazenados em nossos servidores.
          </p>
        </div>
      </div>
    </div>
  );
}

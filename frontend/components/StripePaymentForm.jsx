'use client';

import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

export default function StripePaymentForm({
  clientSecret,
  pedidoId,
  onSuccess,
  onError,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Confirmar o pagamento
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/pedidos/${pedidoId}?payment=success`,
        },
      });

      if (error) {
        // Mostrar erro
        setErrorMessage(error.message);
        setIsProcessing(false);

        if (onError) {
          onError(error);
        }

        toast.error(`Erro no pagamento: ${error.message}`);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Pagamento bem-sucedido
        toast.success('Pagamento realizado com sucesso!');

        if (onSuccess) {
          onSuccess(paymentIntent);
        }
      }
    } catch (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);

      if (onError) {
        onError(error);
      }

      toast.error(`Erro ao processar pagamento: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PaymentElement />

      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? 'Processando pagamento...' : 'Confirmar Pagamento'}
      </button>
    </form>
  );
}

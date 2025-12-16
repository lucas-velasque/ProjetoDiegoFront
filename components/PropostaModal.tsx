"use client";

import { useState, FormEvent } from "react";
import { X } from "lucide-react";
import { createProposta } from "@/lib/api/propostas";
import toast from "react-hot-toast";

interface PropostaModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | number;
  productName: string;
  productPrice: number;
  onPropostaCreated?: () => void;
}

const PropostaModal: React.FC<PropostaModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  productPrice,
  onPropostaCreated,
}) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";
  const [valorProposto, setValorProposto] = useState<string>("");
  const [mensagem, setMensagem] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validações
    if (!valorProposto || parseFloat(valorProposto) <= 0) {
      toast.error("O valor da proposta deve ser maior que zero");
      return;
    }

    setIsSubmitting(true);

    try {
      await createProposta("venda", Number(productId), {
        valor_oferta: parseFloat(valorProposto),
        mensagem: mensagem.trim() || undefined,
      });

      toast.success("Proposta enviada com sucesso!");

      // Limpar campos
      setValorProposto("");
      setMensagem("");

      // Callback para atualizar a lista
      if (onPropostaCreated) {
        onPropostaCreated();
      }

      // Fechar modal
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao enviar proposta";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setValorProposto("");
      setMensagem("");
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-slate-800">
            Fazer Proposta
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Informações do Produto */}
          <div className="mb-6 bg-slate-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Produto:</p>
            <p className="text-lg font-medium text-slate-800">{productName}</p>
            <p className="text-sm text-slate-600 mt-2">Preço atual:</p>
            <p className="text-xl font-semibold text-slate-800">
              {currency}
              {productPrice?.toFixed(2)}
            </p>
          </div>

          {/* Valor da Proposta */}
          <div className="mb-4">
            <label
              htmlFor="valor_proposto"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Valor da proposta <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
                {currency}
              </span>
              <input
                type="number"
                id="valor_proposto"
                value={valorProposto}
                onChange={(e) => setValorProposto(e.target.value)}
                step="0.01"
                min="0"
                placeholder="0.00"
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          {/* Mensagem */}
          <div className="mb-6">
            <label
              htmlFor="mensagem"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Mensagem (opcional)
            </label>
            <textarea
              id="mensagem"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={4}
              placeholder="Ex: Aceita R$ 85 à vista?"
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent resize-none transition disabled:opacity-50 disabled:cursor-not-allowed"
              maxLength={500}
            />
            <p className="text-xs text-slate-500 mt-1">
              {mensagem.length}/500 caracteres
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Enviando..." : "Enviar Proposta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropostaModal;

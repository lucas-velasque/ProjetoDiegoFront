"use client";

import { useState, useEffect } from "react";
import { User, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { getPropostasByAnuncio, acceptProposta, type Proposta } from "@/lib/api/propostas";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import toast from "react-hot-toast";

interface ListaPropostasProps {
  productId: string | number;
  tipo?: 'venda' | 'compra';
}

const ListaPropostas: React.FC<ListaPropostasProps> = ({ productId, tipo = "venda" }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPropostas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPropostasByAnuncio(tipo, productId);
      setPropostas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar propostas:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchPropostas();
    }
  }, [productId, tipo]);

  const handleAcceptProposta = async (propostaId: number) => {
    try {
      await acceptProposta(propostaId);
      toast.success("Proposta aceita com sucesso!");
      // Atualizar lista
      fetchPropostas();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao aceitar proposta";
      toast.error(errorMessage);
    }
  };

  const getStatusBadge = (status: Proposta['status']) => {
    const statusConfig = {
      pendente: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: <Clock size={14} />,
        label: "Pendente",
      },
      aceita: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <CheckCircle size={14} />,
        label: "Aceita",
      },
      recusada: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <XCircle size={14} />,
        label: "Recusada",
      },
      cancelada: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: <AlertCircle size={14} />,
        label: "Cancelada",
      },
    };

    const config = statusConfig[status] || statusConfig.pendente;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  const formatDate = (date: Date | string) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return "Data inválida";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">
          Propostas Recebidas
        </h3>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-slate-100 rounded-lg p-4 animate-pulse"
            >
              <div className="h-4 bg-slate-300 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-slate-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">
          Propostas Recebidas
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">
            Erro ao carregar propostas: {error}
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (propostas.length === 0) {
    return (
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">
          Propostas Recebidas
        </h3>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
          <User className="mx-auto text-slate-400 mb-3" size={48} />
          <p className="text-slate-600">Ainda não há propostas para este produto.</p>
        </div>
      </div>
    );
  }

  // Lista de propostas
  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">
        Propostas Recebidas ({propostas.length})
      </h3>

      <div className="space-y-4">
        {propostas.map((proposta) => (
          <div
            key={proposta.id}
            className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Informações da proposta */}
              <div className="flex-1">
                {/* Usuário e Data */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-slate-200 rounded-full p-2">
                    <User size={16} className="text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Usuário #{proposta.usuario_id}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(proposta.created_at)}
                    </p>
                  </div>
                </div>

                {/* Valor e Mensagem */}
                <div className="mt-3">
                  <p className="text-2xl font-bold text-slate-800 mb-2">
                    {currency}
                    {parseFloat(proposta.valor_proposto.toString()).toFixed(2)}
                  </p>
                  {proposta.mensagem && (
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                      "{proposta.mensagem}"
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="mt-3">{getStatusBadge(proposta.status)}</div>
              </div>

              {/* Ações (apenas para propostas pendentes) */}
              {proposta.status === "pendente" && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleAcceptProposta(proposta.id)}
                    className="px-4 py-2 bg-[#00004F] text-white text-sm font-medium rounded-lg hover:bg-[#3C5AA6] active:scale-95 transition whitespace-nowrap"
                    type="button"
                  >
                    Aceitar
                  </button>
                  {/* TODO: Implementar recusar proposta */}
                  {/* <button
                    className="px-4 py-2 border border-red-600 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 active:scale-95 transition whitespace-nowrap"
                    type="button"
                  >
                    Recusar
                  </button> */}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaPropostas;

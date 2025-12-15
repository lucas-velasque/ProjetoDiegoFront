"use client";
import { useEffect, useState } from "react";
import { getAnunciosVenda, deleteAnuncioVenda, updateAnuncioVenda, type AnuncioVenda } from "@/lib/api/anunciosVenda";
import toast from "react-hot-toast";
import { Trash2, Edit, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StoreManageProducts() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [anuncios, setAnuncios] = useState<AnuncioVenda[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchAnuncios = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar apenas anúncios do usuário atual
      // TODO: Quando implementar autenticação, filtrar por usuario_id
      const response = await getAnunciosVenda();

      const data = Array.isArray(response) ? response : response.data;
      setAnuncios(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar anúncios';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este anúncio?")) {
      return;
    }

    try {
      await deleteAnuncioVenda(id);
      toast.success("Anúncio deletado com sucesso!");
      // Atualizar lista
      fetchAnuncios();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar anúncio';
      toast.error(errorMessage);
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'ativo' ? 'cancelado' : 'ativo';

    try {
      await updateAnuncioVenda(id, { status: newStatus as 'ativo' | 'cancelado' });
      toast.success(`Anúncio ${newStatus === 'ativo' ? 'ativado' : 'desativado'} com sucesso!`);
      // Atualizar lista
      fetchAnuncios();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status';
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchAnuncios();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div>
        <h1 className="text-2xl text-slate-500 mb-5">
          Gerenciar <span className="text-slate-800 font-medium">Anúncios</span>
        </h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-100 h-16 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <h1 className="text-2xl text-slate-500 mb-5">
          Gerenciar <span className="text-slate-800 font-medium">Anúncios</span>
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">Erro: {error}</p>
          <button
            onClick={fetchAnuncios}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (anuncios.length === 0) {
    return (
      <div>
        <h1 className="text-2xl text-slate-500 mb-5">
          Gerenciar <span className="text-slate-800 font-medium">Anúncios</span>
        </h1>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
          <p className="text-slate-600 mb-4">Você ainda não criou nenhum anúncio</p>
          <button
            onClick={() => router.push('/store/add-product')}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition"
          >
            Criar primeiro anúncio
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl text-slate-500">
          Gerenciar <span className="text-slate-800 font-medium">Anúncios</span>
        </h1>
        <button
          onClick={() => router.push('/store/add-product')}
          className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-900 transition"
        >
          + Novo Anúncio
        </button>
      </div>

      {/* Tabela Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full max-w-6xl text-left ring ring-slate-200 rounded-lg overflow-hidden text-sm">
          <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Quantidade</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {anuncios.map((anuncio) => (
              <tr
                key={anuncio.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-3">#{anuncio.id}</td>
                <td className="px-4 py-3 font-medium max-w-xs truncate">{anuncio.titulo}</td>
                <td className="px-4 py-3">
                  {currency}{Number(anuncio.preco_total).toFixed(2)}
                </td>
                <td className="px-4 py-3">{anuncio.quantidade_disponivel}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      anuncio.status === 'ativo'
                        ? 'bg-green-100 text-green-800'
                        : anuncio.status === 'vendido'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {anuncio.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/product/${anuncio.id}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                      title="Visualizar"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => toggleStatus(anuncio.id, anuncio.status)}
                      className={`px-3 py-1 text-xs rounded transition ${
                        anuncio.status === 'ativo'
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {anuncio.status === 'ativo' ? 'Desativar' : 'Ativar'}
                    </button>
                    <button
                      onClick={() => handleDelete(anuncio.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      title="Deletar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile */}
      <div className="md:hidden space-y-4">
        {anuncios.map((anuncio) => (
          <div
            key={anuncio.id}
            className="bg-white border border-slate-200 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-slate-800 mb-1">{anuncio.titulo}</h3>
                <p className="text-sm text-slate-500">ID: #{anuncio.id}</p>
              </div>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  anuncio.status === 'ativo'
                    ? 'bg-green-100 text-green-800'
                    : anuncio.status === 'vendido'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {anuncio.status.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-slate-800">
                {currency}{Number(anuncio.preco_total).toFixed(2)}
              </span>
              <span className="text-sm text-slate-600">
                Qtd: {anuncio.quantidade_disponivel}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/product/${anuncio.id}`)}
                className="flex-1 px-3 py-2 border border-slate-300 text-slate-700 text-sm rounded-lg hover:bg-slate-50 transition"
              >
                Visualizar
              </button>
              <button
                onClick={() => toggleStatus(anuncio.id, anuncio.status)}
                className={`flex-1 px-3 py-2 text-sm rounded-lg transition ${
                  anuncio.status === 'ativo'
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {anuncio.status === 'ativo' ? 'Desativar' : 'Ativar'}
              </button>
              <button
                onClick={() => handleDelete(anuncio.id)}
                className="px-3 py-2 bg-red-100 text-red-800 text-sm rounded-lg hover:bg-red-200 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

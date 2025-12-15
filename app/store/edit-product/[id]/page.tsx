"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAnuncioVendaById, updateAnuncioVenda } from "@/lib/api/anunciosVenda";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function StoreEditProduct() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    preco_total: "",
    quantidade_disponivel: "",
    status: "ativo" as "ativo" | "vendido" | "cancelado",
  });

  useEffect(() => {
    const fetchAnuncio = async () => {
      try {
        setFetchingData(true);
        const anuncio = await getAnuncioVendaById(Number(id));

        setFormData({
          titulo: anuncio.titulo,
          descricao: anuncio.descricao || "",
          preco_total: String(anuncio.preco_total),
          quantidade_disponivel: String(anuncio.quantidade_disponivel),
          status: anuncio.status,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro ao carregar anúncio";
        toast.error(errorMessage);
        router.push("/store/manage-product");
      } finally {
        setFetchingData(false);
      }
    };

    if (id) {
      fetchAnuncio();
    }
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.titulo.trim()) {
      toast.error("Título é obrigatório");
      return;
    }

    if (!formData.preco_total || Number(formData.preco_total) <= 0) {
      toast.error("Preço deve ser maior que zero");
      return;
    }

    if (!formData.quantidade_disponivel || Number(formData.quantidade_disponivel) < 1) {
      toast.error("Quantidade deve ser pelo menos 1");
      return;
    }

    setLoading(true);

    try {
      await updateAnuncioVenda(Number(id), {
        titulo: formData.titulo,
        descricao: formData.descricao || undefined,
        preco_total: Number(formData.preco_total),
        quantidade_disponivel: Number(formData.quantidade_disponivel),
        status: formData.status,
      });

      toast.success("Anúncio atualizado com sucesso!");

      setTimeout(() => {
        router.push("/store/manage-product");
      }, 1000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao atualizar anúncio";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="min-h-screen">
        <div className="max-w-3xl mx-auto py-8 px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto py-8 px-6">
        <button
          onClick={() => router.push("/store/manage-product")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 transition"
        >
          <ArrowLeft size={20} />
          Voltar para gerenciar
        </button>

        <h1 className="text-3xl font-semibold text-slate-800 mb-8">
          Editar Anúncio
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-slate-700 mb-2">
              Título
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              onChange={handleChange}
              value={formData.titulo}
              placeholder="Ex: Charizard Raro 1ª Edição"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
              maxLength={255}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-slate-700 mb-2">
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              onChange={handleChange}
              value={formData.descricao}
              placeholder="Descreva o produto, condição, observações..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="preco_total" className="block text-sm font-medium text-slate-700 mb-2">
                Preço Total
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                <input
                  type="number"
                  id="preco_total"
                  name="preco_total"
                  onChange={handleChange}
                  value={formData.preco_total}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="quantidade_disponivel" className="block text-sm font-medium text-slate-700 mb-2">
                Quantidade Disponível
              </label>
              <input
                type="number"
                id="quantidade_disponivel"
                name="quantidade_disponivel"
                onChange={handleChange}
                value={formData.quantidade_disponivel}
                placeholder="1"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
              Status do Anúncio
            </label>
            <select
              id="status"
              name="status"
              onChange={handleChange}
              value={formData.status}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={loading}
            >
              <option value="ativo">Ativo</option>
              <option value="vendido">Vendido</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 md:flex-none md:px-12 py-3 bg-[#00004F] text-white font-medium rounded-full hover:bg-[#3C5AA6] active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/store/manage-product")}
              disabled={loading}
              className="flex-1 md:flex-none md:px-12 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-full hover:bg-slate-50 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createAnuncioVenda } from "@/lib/api/anunciosVenda";
import toast from "react-hot-toast";

export default function StoreAddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    preco_total: "",
    quantidade_disponivel: "1",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      await createAnuncioVenda({
        titulo: formData.titulo,
        descricao: formData.descricao || undefined,
        preco_total: Number(formData.preco_total),
        quantidade_disponivel: Number(formData.quantidade_disponivel),
        cartas: [],
      });

      toast.success("Anúncio criado com sucesso!");

      setFormData({
        titulo: "",
        descricao: "",
        preco_total: "",
        quantidade_disponivel: "1",
      });

      setTimeout(() => {
        router.push("/store/manage-product");
      }, 1000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar anúncio";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto py-8 px-6">
        <h1 className="text-3xl font-semibold text-slate-800 mb-8">
          Adicionar Anúncio
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
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

          {/* Descrição */}
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
            {/* Preço */}
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

            {/* Quantidade */}
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

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 md:flex-none md:px-12 py-3 bg-[#00004F] text-white font-medium rounded-full hover:bg-[#3C5AA6] active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adicionando..." : "Adicionar Anúncio"}
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

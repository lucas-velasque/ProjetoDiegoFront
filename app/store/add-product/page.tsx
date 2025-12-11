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

<<<<<<< HEAD
=======
  // Por enquanto, vamos simplificar sem cartas (até termos o CRUD de cartas)
  // Quando integrar upload de imagens, adicionar aqui

>>>>>>> bcffeb271a62fe83e6127eb982ded50aab02ba51
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

<<<<<<< HEAD
=======
    // Validações básicas
>>>>>>> bcffeb271a62fe83e6127eb982ded50aab02ba51
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
<<<<<<< HEAD
=======
      // Por enquanto, criar anúncio sem cartas
      // Quando integrar CRUD de cartas, permitir seleção
>>>>>>> bcffeb271a62fe83e6127eb982ded50aab02ba51
      await createAnuncioVenda({
        titulo: formData.titulo,
        descricao: formData.descricao || undefined,
        preco_total: Number(formData.preco_total),
        quantidade_disponivel: Number(formData.quantidade_disponivel),
<<<<<<< HEAD
        cartas: [],
=======
        cartas: [], // Vazio por enquanto
>>>>>>> bcffeb271a62fe83e6127eb982ded50aab02ba51
      });

      toast.success("Anúncio criado com sucesso!");

<<<<<<< HEAD
=======
      // Limpar formulário
>>>>>>> bcffeb271a62fe83e6127eb982ded50aab02ba51
      setFormData({
        titulo: "",
        descricao: "",
        preco_total: "",
        quantidade_disponivel: "1",
      });

<<<<<<< HEAD
=======
      // Redirecionar para gerenciar produtos após 1 segundo
>>>>>>> bcffeb271a62fe83e6127eb982ded50aab02ba51
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
<<<<<<< HEAD
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
=======
    <form
      onSubmit={handleSubmit}
      className="text-slate-500 mb-28"
    >
      <h1 className="text-2xl mb-6">
        Adicionar <span className="text-slate-800 font-medium">Anúncio</span>
      </h1>

      {/* Título */}
      <label className="flex flex-col gap-2 my-6">
        <span className="font-medium text-slate-700">Título *</span>
        <input
          type="text"
          name="titulo"
          onChange={handleChange}
          value={formData.titulo}
          placeholder="Ex: Charizard Raro 1ª Edição"
          className="w-full max-w-lg p-3 px-4 outline-none border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent transition"
          required
          maxLength={255}
          disabled={loading}
        />
      </label>

      {/* Descrição */}
      <label className="flex flex-col gap-2 my-6">
        <span className="font-medium text-slate-700">Descrição</span>
        <textarea
          name="descricao"
          onChange={handleChange}
          value={formData.descricao}
          placeholder="Descreva o produto, condição, observações..."
          className="w-full max-w-lg p-3 px-4 outline-none border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent resize-none transition"
          rows={4}
          disabled={loading}
        />
      </label>

      {/* Preço */}
      <label className="flex flex-col gap-2 my-6">
        <span className="font-medium text-slate-700">Preço Total *</span>
        <div className="relative w-full max-w-lg">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">R$</span>
          <input
            type="number"
            name="preco_total"
            onChange={handleChange}
            value={formData.preco_total}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full pl-12 pr-4 p-3 outline-none border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent transition"
            required
            disabled={loading}
          />
        </div>
      </label>

      {/* Quantidade */}
      <label className="flex flex-col gap-2 my-6">
        <span className="font-medium text-slate-700">Quantidade Disponível *</span>
        <input
          type="number"
          name="quantidade_disponivel"
          onChange={handleChange}
          value={formData.quantidade_disponivel}
          placeholder="1"
          min="1"
          className="w-full max-w-lg p-3 px-4 outline-none border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent transition"
          required
          disabled={loading}
        />
      </label>

      {/* Botões */}
      <div className="flex gap-3 mt-8">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-900 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Criando..." : "Criar Anúncio"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/store/manage-product")}
          disabled={loading}
          className="px-8 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
      </div>

      {/* Nota sobre upload de imagens */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-lg">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Upload de imagens e seleção de cartas serão implementados em breve.
        </p>
      </div>
    </form>
>>>>>>> bcffeb271a62fe83e6127eb982ded50aab02ba51
  );
}

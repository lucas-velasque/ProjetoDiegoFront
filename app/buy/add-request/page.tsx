"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createAnuncioCompra } from "@/lib/api/anunciosCompra";
import toast from "react-hot-toast";

const RARIDADADES = [
  'Common',
  'Uncommon',
  'Rare',
  'Rare Holo',
  'Rare Ultra',
  'Secret Rare'
];

const EDICOES = [
  'First Edition',
  'Unlimited',
  'Shadowless'
];

const CONDICOES = [
  'Gem Mint',
  'Mint',
  'Near Mint',
  'Excellent',
  'Good',
  'Light Played',
  'Played',
  'Poor'
];

const TIPOS = [
  'Normal',
  'Fire',
  'Water',
  'Electric',
  'Grass',
  'Ice',
  'Fighting',
  'Poison',
  'Ground',
  'Flying',
  'Psychic',
  'Bug',
  'Rock',
  'Ghost',
  'Dark',
  'Dragon',
  'Steel',
  'Fairy'
];

export default function BuyAddRequest() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome_carta: "",
    expansao: "",
    numero_expansao: "",
    raridade: "",
    edicao: "",
    quantidade: "1",
    preco_maximo: "",
    condicao_minima: "",
    tipos: [] as string[],
    variacao: "",
    descricao: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTipoToggle = (tipo: string) => {
    setFormData(prev => ({
      ...prev,
      tipos: prev.tipos.includes(tipo)
        ? prev.tipos.filter(t => t !== tipo)
        : [...prev.tipos, tipo]
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.nome_carta.trim()) {
      toast.error("Nome da carta é obrigatório");
      return;
    }

    if (!formData.quantidade || Number(formData.quantidade) < 1) {
      toast.error("Quantidade deve ser pelo menos 1");
      return;
    }

    setLoading(true);

    try {
      await createAnuncioCompra({
        nome_carta: formData.nome_carta,
        expansao: formData.expansao || undefined,
        numero_expansao: formData.numero_expansao || undefined,
        raridade: formData.raridade || undefined,
        edicao: formData.edicao || undefined,
        quantidade: Number(formData.quantidade),
        preco_maximo: formData.preco_maximo ? Number(formData.preco_maximo) : undefined,
        condicao_minima: formData.condicao_minima || undefined,
        tipos: formData.tipos.length > 0 ? formData.tipos : undefined,
        variacao: formData.variacao || undefined,
        descricao: formData.descricao || undefined,
      });

      toast.success("Anúncio de compra criado com sucesso!");

      setFormData({
        nome_carta: "",
        expansao: "",
        numero_expansao: "",
        raridade: "",
        edicao: "",
        quantidade: "1",
        preco_maximo: "",
        condicao_minima: "",
        tipos: [],
        variacao: "",
        descricao: "",
      });

      setTimeout(() => {
        router.push("/buy/my-requests");
      }, 1000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar anúncio de compra";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto py-8 px-6">
        <h1 className="text-3xl font-semibold text-slate-800 mb-8">
          Criar Anúncio de Compra
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nome_carta" className="block text-sm font-medium text-slate-700 mb-2">
                Nome da Carta *
              </label>
              <input
                type="text"
                id="nome_carta"
                name="nome_carta"
                onChange={handleChange}
                value={formData.nome_carta}
                placeholder="Ex: Pikachu"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
                maxLength={255}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="expansao" className="block text-sm font-medium text-slate-700 mb-2">
                Expansão
              </label>
              <input
                type="text"
                id="expansao"
                name="expansao"
                onChange={handleChange}
                value={formData.expansao}
                placeholder="Ex: Base Set"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                maxLength={100}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="numero_expansao" className="block text-sm font-medium text-slate-700 mb-2">
                Número da Expansão
              </label>
              <input
                type="text"
                id="numero_expansao"
                name="numero_expansao"
                onChange={handleChange}
                value={formData.numero_expansao}
                placeholder="Ex: 58/102"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                maxLength={50}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="raridade" className="block text-sm font-medium text-slate-700 mb-2">
                Raridade
              </label>
              <select
                id="raridade"
                name="raridade"
                onChange={handleChange}
                value={formData.raridade}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={loading}
              >
                <option value="">Selecione</option>
                {RARIDADADES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="edicao" className="block text-sm font-medium text-slate-700 mb-2">
                Edição
              </label>
              <select
                id="edicao"
                name="edicao"
                onChange={handleChange}
                value={formData.edicao}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={loading}
              >
                <option value="">Selecione</option>
                {EDICOES.map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="variacao" className="block text-sm font-medium text-slate-700 mb-2">
                Variação
              </label>
              <input
                type="text"
                id="variacao"
                name="variacao"
                onChange={handleChange}
                value={formData.variacao}
                placeholder="Ex: Star, EX, GX, V, VMAX"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                maxLength={50}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="condicao_minima" className="block text-sm font-medium text-slate-700 mb-2">
                Condição Mínima
              </label>
              <select
                id="condicao_minima"
                name="condicao_minima"
                onChange={handleChange}
                value={formData.condicao_minima}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={loading}
              >
                <option value="">Selecione</option>
                {CONDICOES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipos do Pokemon
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {TIPOS.map(tipo => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => handleTipoToggle(tipo)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    formData.tipos.includes(tipo)
                      ? 'bg-[#00004F] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  disabled={loading}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="quantidade" className="block text-sm font-medium text-slate-700 mb-2">
                Quantidade *
              </label>
              <input
                type="number"
                id="quantidade"
                name="quantidade"
                onChange={handleChange}
                value={formData.quantidade}
                placeholder="1"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="preco_maximo" className="block text-sm font-medium text-slate-700 mb-2">
                Preço Máximo (por unidade)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                <input
                  type="number"
                  id="preco_maximo"
                  name="preco_maximo"
                  onChange={handleChange}
                  value={formData.preco_maximo}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-slate-700 mb-2">
              Descrição / Observações
            </label>
            <textarea
              id="descricao"
              name="descricao"
              onChange={handleChange}
              value={formData.descricao}
              placeholder="Busco Pikachu First Edition em Near Mint para minha coleção..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 md:flex-none md:px-12 py-3 bg-[#00004F] text-white font-medium rounded-full hover:bg-[#3C5AA6] active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Criando..." : "Criar Anúncio"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/buy/my-requests")}
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

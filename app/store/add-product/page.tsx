"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createAnuncioVenda } from "@/lib/api/anunciosVenda";
import toast from "react-hot-toast";
import { Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import CardSelector from "./components/CardSelector";
import { Carta } from "@/types";
import { useImageUpload } from "@/lib/hooks/useImageUpload";

interface CartaFormData {
  carta_id: number;
  cartaData?: Carta;
  quantidade: number;
  condicao: string;
  observacoes: string;
  foto?: File;
  foto_preview?: string;
  foto_url?: string;
}

export default function StoreAddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { uploadImage, uploading } = useImageUpload();

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    preco_total: "",
    quantidade_disponivel: "1",
  });

  const [cartas, setCartas] = useState<CartaFormData[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdicionarCarta = () => {
    setCartas([...cartas, {
      carta_id: 0,
      quantidade: 1,
      condicao: "",
      observacoes: "",
    }]);
  };

  const handleRemoverCarta = (index: number) => {
    setCartas(cartas.filter((_, i) => i !== index));
  };

  const handleCartaChange = (index: number, field: keyof CartaFormData, value: any) => {
    const newCartas = [...cartas];
    newCartas[index] = { ...newCartas[index], [field]: value };
    setCartas(newCartas);
  };

  const handleCardSelect = (index: number, cartaId: number, carta: Carta) => {
    const newCartas = [...cartas];
    newCartas[index] = {
      ...newCartas[index],
      carta_id: cartaId,
      cartaData: carta
    };
    setCartas(newCartas);
  };

  const handleFotoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        handleCartaChange(index, 'foto', file);
        handleCartaChange(index, 'foto_preview', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

    if (cartas.length === 0) {
      toast.error("Adicione pelo menos uma carta ao anúncio");
      return;
    }

    for (let i = 0; i < cartas.length; i++) {
      if (!cartas[i].carta_id || cartas[i].carta_id === 0) {
        toast.error(`Selecione uma carta válida para o item ${i + 1}`);
        return;
      }
      if (cartas[i].quantidade < 1) {
        toast.error(`Quantidade inválida para o item ${i + 1}`);
        return;
      }
    }

    setLoading(true);

    try {
      // Fazer upload das fotos antes de criar o anúncio
      const cartasComFoto = await Promise.all(
        cartas.map(async (carta) => {
          let foto_url = undefined;

          if (carta.foto) {
            toast.loading(`Fazendo upload da foto da carta ${carta.cartaData?.nome || carta.carta_id}...`);
            const { url, error } = await uploadImage(carta.foto, 'cartas');
            toast.dismiss();

            if (error) {
              throw new Error(`Erro ao fazer upload: ${error}`);
            }

            foto_url = url || undefined;
          }

          return {
            carta_id: carta.carta_id,
            quantidade: carta.quantidade,
            condicao: carta.condicao || undefined,
            observacoes: carta.observacoes || undefined,
            foto_url,
          };
        })
      );

      await createAnuncioVenda({
        titulo: formData.titulo,
        descricao: formData.descricao || undefined,
        preco_total: Number(formData.preco_total),
        quantidade_disponivel: Number(formData.quantidade_disponivel),
        cartas: cartasComFoto,
      });

      toast.success("Anúncio criado com sucesso!");

      setFormData({
        titulo: "",
        descricao: "",
        preco_total: "",
        quantidade_disponivel: "1",
      });
      setCartas([]);

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

          {/* Seção de Cartas */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800">
                Cartas do Anúncio
              </h2>
              <button
                type="button"
                onClick={handleAdicionarCarta}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-[#00004F] text-white text-sm font-medium rounded-lg hover:bg-[#3C5AA6] active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={18} />
                Adicionar Carta
              </button>
            </div>

            {cartas.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">
                  Nenhuma carta adicionada. Clique em "Adicionar Carta" para começar.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartas.map((carta, index) => (
                  <div key={index} className="border border-gray-300 rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium text-slate-700">Carta #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => handleRemoverCarta(index)}
                        disabled={loading}
                        className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Card Selector */}
                      <div>
                        <CardSelector
                          value={carta.carta_id || null}
                          onChange={(cartaId, cartaData) => handleCardSelect(index, cartaId, cartaData)}
                          disabled={loading}
                        />
                      </div>

                      {/* Quantidade */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Quantidade *
                        </label>
                        <input
                          type="number"
                          value={carta.quantidade}
                          onChange={(e) => handleCartaChange(index, 'quantidade', Number(e.target.value))}
                          placeholder="1"
                          min="1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          required
                          disabled={loading}
                        />
                      </div>

                      {/* Condição */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Condição
                        </label>
                        <select
                          value={carta.condicao}
                          onChange={(e) => handleCartaChange(index, 'condicao', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          disabled={loading}
                        >
                          <option value="">Selecione</option>
                          <option value="Mint">Mint</option>
                          <option value="Near Mint">Near Mint</option>
                          <option value="Excellent">Excellent</option>
                          <option value="Good">Good</option>
                          <option value="Light Played">Light Played</option>
                          <option value="Played">Played</option>
                          <option value="Poor">Poor</option>
                        </select>
                      </div>

                      {/* Upload de Foto */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Foto da Carta
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFotoUpload(index, e)}
                            className="hidden"
                            id={`foto-${index}`}
                            disabled={loading}
                          />
                          <label
                            htmlFor={`foto-${index}`}
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                          >
                            <ImageIcon size={20} className="text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {carta.foto ? carta.foto.name : "Escolher foto"}
                            </span>
                          </label>
                        </div>
                        {carta.foto_preview && (
                          <div className="mt-2">
                            <img
                              src={carta.foto_preview}
                              alt="Preview"
                              className="w-full h-32 object-cover rounded-lg border border-gray-300"
                            />
                          </div>
                        )}
                      </div>

                      {/* Observações */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Observações
                        </label>
                        <textarea
                          value={carta.observacoes}
                          onChange={(e) => handleCartaChange(index, 'observacoes', e.target.value)}
                          placeholder="Ex: Carta em perfeito estado, sem arranhões..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
                          rows={2}
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 md:flex-none md:px-12 py-3 bg-[#00004F] text-white font-medium rounded-full hover:bg-[#3C5AA6] active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading || uploading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  {uploading ? "Fazendo upload..." : "Adicionando..."}
                </>
              ) : (
                "Adicionar Anúncio"
              )}
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

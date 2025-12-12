"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { criarLeilao } from "@/lib/api/leiloes";
import type { CriarLeilaoInput } from "@/lib/types/leilao";

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-3xl p-4 md:p-8">{children}</div>
    </div>
  );
}

interface FormState {
  titulo: string;
  descricao: string;
  status: "aberto" | "encerrado";
  precoInicial: string;
  precoAtual: string;
  valor_incremento: string;
  terminaEmData: string;
  terminaEmHora: string;
  vendedorId: string;
}

export default function NovoLeilaoAdminPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    titulo: "",
    descricao: "",
    status: "aberto",
    precoInicial: "",
    precoAtual: "",
    valor_incremento: "",
    terminaEmData: "",
    terminaEmHora: "",
    vendedorId: "1",
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  function onChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function toISO(data: string, hora: string) {
    return new Date(`${data}T${hora}:00`).toISOString();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setSucesso(null);
    setLoading(true);

    try {
      if (!form.titulo.trim()) throw new Error("Título é obrigatório.");
      if (!form.precoInicial) throw new Error("Preço inicial é obrigatório.");
      if (!form.precoAtual) throw new Error("Preço atual é obrigatório.");
      if (!form.valor_incremento) throw new Error("Valor de incremento é obrigatório.");
      if (!form.terminaEmData || !form.terminaEmHora)
        throw new Error("Data e hora de término são obrigatórias.");
      if (!form.vendedorId) throw new Error("VendedorId é obrigatório.");

      const payload: CriarLeilaoInput = {
        titulo: form.titulo,
        descricao: form.descricao,
        status: form.status,
        precoInicial: Number(form.precoInicial),
        precoAtual: Number(form.precoAtual),
        valor_incremento: Number(form.valor_incremento),
        terminaEm: toISO(form.terminaEmData, form.terminaEmHora),
        vendedorId: Number(form.vendedorId),
        categoriaLeilaoId: null,
      };

      await criarLeilao(payload);

      setSucesso("Leilão criado com sucesso!");
      setTimeout(() => router.push("/admin/leiloes"), 700);
    } catch (e: any) {
      setErro(e?.message || "Falha ao criar leilão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminShell>
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h1 className="text-xl font-semibold">Criar leilão</h1>
          <button
            type="button"
            onClick={() => router.push("/admin/leiloes")}
            className="text-sm underline text-gray-600"
          >
            Voltar
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-sm">
          <div className="space-y-1">
            <label htmlFor="titulo" className="block font-medium">Título</label>
            <input
              id="titulo"
              name="titulo"
              value={form.titulo}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Informe o título"
              autoComplete="off"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="descricao" className="block font-medium">Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              value={form.descricao}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Informe a descrição"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="status" className="block font-medium">Status</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="aberto">Aberto</option>
                <option value="encerrado">Encerrado</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="vendedorId" className="block font-medium">Vendedor ID</label>
              <input
                id="vendedorId"
                name="vendedorId"
                value={form.vendedorId}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
                inputMode="numeric"
                placeholder="Ex: 1"
              />
              <p className="text-xs text-gray-500">
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="precoInicial" className="block font-medium">Preço inicial</label>
              <input
                id="precoInicial"
                type="number"
                min="0"
                step="0.01"
                name="precoInicial"
                value={form.precoInicial}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
                placeholder="0,00"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="precoAtual" className="block font-medium">Preço atual</label>
              <input
                id="precoAtual"
                type="number"
                min="0"
                step="0.01"
                name="precoAtual"
                value={form.precoAtual}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="valor_incremento" className="block font-medium">Valor de incremento</label>
            <input
              id="valor_incremento"
              type="number"
              min="0"
              step="0.01"
              name="valor_incremento"
              value={form.valor_incremento}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Ex: 5,00"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="terminaEmData" className="block font-medium">Data de término</label>
              <input
                id="terminaEmData"
                type="date"
                name="terminaEmData"
                value={form.terminaEmData}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="terminaEmHora" className="block font-medium">Hora de término</label>
              <input
                id="terminaEmHora"
                type="time"
                name="terminaEmHora"
                value={form.terminaEmHora}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {erro && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-100 rounded p-3">
              {erro}
            </div>
          )}
          {sucesso && (
            <div className="text-xs text-green-700 bg-green-50 border border-green-100 rounded p-3">
              {sucesso}
            </div>
          )}

          <div className="pt-2 flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => router.push("/admin/leiloes")}
              className="px-4 py-2 rounded-full border text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-full bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}

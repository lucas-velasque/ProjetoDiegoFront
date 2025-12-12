"use client";

import { useEffect, useMemo, useState } from "react";
import type { Leilao } from "@/lib/types/leilao";
import { excluirLeilao, listarLeiloes } from "@/lib/api/leiloes";

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl p-4 md:p-8">{children}</div>
    </div>
  );
}

export default function AdminLeiloesPage() {
  const [items, setItems] = useState<Leilao[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function carregar() {
    setErro(null);
    setLoading(true);
    try {
      const resp = await listarLeiloes({ page: 1, limit: 50, titulo: busca });
      setItems(resp.items);
    } catch (e: any) {
      setErro(e?.message || "Falha ao carregar leilões");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => carregar(), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca]);

  async function onDelete(id: string) {
    const ok = confirm("Tem certeza que deseja excluir/desativar este leilão?");
    if (!ok) return;

    setDeletingId(id);
    setErro(null);
    try {
      await excluirLeilao(id);
      await carregar();
    } catch (e: any) {
      setErro(e?.message || "Falha ao excluir leilão");
    } finally {
      setDeletingId(null);
    }
  }

  const vazio = useMemo(() => !loading && items.length === 0, [loading, items]);

  return (
    <AdminShell>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-xl font-semibold">Leilões</h1>

          <div className="flex gap-2 items-center">
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar"
              className="border rounded-full px-4 py-2 text-sm w-full md:w-72"
              aria-label="Buscar leilões"
            />
            <a
              href="/admin/leiloes/novo"
              className="hidden md:inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
            >
              + Novo
            </a>
          </div>
        </div>

        <a
          href="/admin/leiloes/novo"
          className="md:hidden fixed bottom-6 right-6 rounded-full w-12 h-12 flex items-center justify-center bg-blue-500 text-white text-2xl shadow-lg"
          aria-label="Novo leilão"
        >
          +
        </a>

        {erro && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded p-3">
            {erro}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="hidden md:grid grid-cols-6 gap-2 px-4 py-3 border-b text-sm font-semibold bg-gray-50">
            <span>Ações</span>
            <span>Título</span>
            <span>Preço inicial</span>
            <span>Preço atual</span>
            <span>Status</span>
            <span>Termina em</span>
          </div>

          <div className="md:hidden divide-y">
            {loading ? (
              <p className="p-4 text-sm text-gray-500">Carregando...</p>
            ) : vazio ? (
              <p className="p-4 text-sm text-gray-500">Nenhum leilão encontrado.</p>
            ) : (
              items.map((l) => (
                <div key={l.id} className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold">{l.titulo}</h2>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        l.status === "aberto"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {l.status}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600">
                    <div>Preço inicial: R$ {l.precoInicial}</div>
                    <div>Preço atual: R$ {l.precoAtual}</div>
                    <div>
                      Termina em:{" "}
                      {l.terminaEm ? new Date(l.terminaEm).toLocaleString("pt-BR") : "-"}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <a
                      href={`/admin/leiloes/${l.id}/editar`}
                      className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-800"
                    >
                      Editar
                    </a>
                    <button
                      onClick={() => onDelete(l.id)}
                      disabled={deletingId === l.id}
                      className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 disabled:opacity-60"
                    >
                      {deletingId === l.id ? "Excluindo..." : "Excluir"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="hidden md:block">
            {loading ? (
              <p className="p-4 text-sm text-gray-500">Carregando...</p>
            ) : vazio ? (
              <p className="p-4 text-sm text-gray-500">Nenhum leilão encontrado.</p>
            ) : (
              items.map((l) => (
                <div
                  key={l.id}
                  className="grid grid-cols-6 gap-2 px-4 py-3 border-b text-sm items-center"
                >
                  <div className="flex gap-2">
                    <button
                      onClick={() => onDelete(l.id)}
                      disabled={deletingId === l.id}
                      className="w-7 h-7 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs disabled:opacity-60"
                      title="Excluir"
                    >
                      X
                    </button>
                    <a
                      href={`/admin/leiloes/${l.id}/editar`}
                      className="w-7 h-7 rounded bg-orange-100 text-orange-700 flex items-center justify-center text-xs"
                      title="Editar"
                    >
                      ✎
                    </a>
                  </div>

                  <span className="truncate">{l.titulo}</span>
                  <span>R$ {l.precoInicial}</span>
                  <span>R$ {l.precoAtual}</span>
                  <span>{l.status}</span>
                  <span>
                    {l.terminaEm ? new Date(l.terminaEm).toLocaleString("pt-BR") : "-"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

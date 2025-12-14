'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { listarMeusLeiloes, excluirMeuLeilao } from '@/lib/api/leiloesUser';

function formatMoney(v) {
  const n = Number(v ?? 0);
  if (Number.isNaN(n)) return 'R$ 0,00';
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function StatusBadge({ status }) {
  const s = String(status ?? '').toLowerCase();
  const isActive = s.includes('aberto') || s.includes('ativo');
  const cls = isActive
    ? 'bg-green-500/10 text-green-300 border-green-500/20'
    : 'bg-gray-500/10 text-gray-200 border-gray-500/20';
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${cls}`}>{status}</span>;
}

export default function LeiloesUsuarioClient() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState({ items: [], page: 1, totalPages: 1, total: 0 });

  const canPrev = page > 1;
  const canNext = page < (data.totalPages || 1);

  const params = useMemo(() => ({ page, limit: 10, q }), [page, q]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await listarMeusLeiloes(params);
      setData(res);
    } catch (e) {
      setError(e?.message || 'Falha ao carregar seus leilões.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function onSearchSubmit(ev) {
    ev.preventDefault();
    setPage(1);
    load();
  }

  async function onDelete(id) {
    if (!confirm('Deseja excluir este leilão?')) return;
    try {
      await excluirMeuLeilao(id);
      await load();
    } catch (e) {
      alert(e?.message || 'Não foi possível excluir.');
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Leilões</h1>
          <p className="text-sm text-gray-400">Gerencie apenas os leilões criados por você.</p>
        </div>

        <Link
          href="/store/leiloes/novo"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Criar leilão
        </Link>
      </div>

      <form onSubmit={onSearchSubmit} className="mb-4 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por título..."
          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-indigo-500/60"
        />
        <button
          type="submit"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Buscar
        </button>
      </form>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/[0.04] text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">Título</th>
                <th className="px-4 py-3 text-left">Preço inicial</th>
                <th className="px-4 py-3 text-left">Preço atual</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                    Carregando...
                  </td>
                </tr>
              ) : data.items?.length ? (
                data.items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">{item.titulo}</td>
                    <td className="px-4 py-3">{formatMoney(item.precoInicial)}</td>
                    <td className="px-4 py-3">{formatMoney(item.precoAtual)}</td>
                    <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/store/leiloes/${item.id}/editar`}
                          className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDelete(item.id)}
                          className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-200 hover:bg-red-500/20"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                    Nenhum leilão encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-white/10 p-3 text-xs text-gray-300">
          <span>
            Página <b>{data.page}</b> de <b>{data.totalPages}</b> • Total: <b>{data.total}</b>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!canPrev}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-1 disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={!canNext}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-1 disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

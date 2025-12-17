'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

import {
  deleteLeilao,
  getUseMockLeiloes,
  listLeiloes,
  setUseMockLeiloes,
  toggleAtivo,
} from '@/lib/services/leiloes.client';
import { getLeilaoMeta } from '@/lib/services/leiloes.meta';

type Mode = 'admin' | 'user';

type Props = {
  mode: Mode;
  title?: string;
  subtitle?: string;
};

function toMoney(v: any) {
  const n = Number(String(v ?? 0).replace(',', '.'));
  if (!Number.isFinite(n)) return 'R$ 0,00';
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function toDateTime(iso?: string | null) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('pt-BR');
}

function getBackendUserId(): number | undefined {
  if (typeof window === 'undefined') return undefined;
  const raw = window.localStorage.getItem('backend_user_id');
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : undefined;
}

export default function LeiloesListClient({ mode, title = 'Leilões', subtitle }: Props) {
  const router = useRouter();
  const { user, isSignedIn } = useUser();

  const [useMock, setUseMock] = useState(false);

  const [q, setQ] = useState('');
  const [status, setStatus] = useState('todos');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [raridade, setRaridade] = useState('todos');
  const [estadoCarta, setEstadoCarta] = useState('todos');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setUseMock(getUseMockLeiloes());
  }, []);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      try {
        const backendUserId = getBackendUserId();
        const res = await listLeiloes({
          page,
          limit,
          q,
          status,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
          raridade,
          estadoCarta,
          scope: mode === 'admin' ? 'all' : 'mine',
          ownerId: user?.id,
          ownerDbId: backendUserId,
        });

        if (!alive) return;
        setItems(res.items ?? []);
        setTotal(res.total ?? 0);
      } catch (err: any) {
        console.error(err);
        if (!alive) return;
        setItems([]);
        setTotal(0);
        toast.error(err?.message || 'Falha ao carregar leilões.');
      } finally {
        if (alive) setLoading(false);
      }
    }

    // reset page if filters change
    load();
    return () => {
      alive = false;
    };
  }, [page, limit, q, status, dateFrom, dateTo, raridade, estadoCarta, mode, user?.id]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  function onToggleSource() {
    const next = !useMock;
    setUseMockLeiloes(next);
    setUseMock(next);
    // recarrega lista
    setPage(1);
  }

  async function onDelete(id: string) {
    if (!confirm('Excluir este leilão?')) return;
    try {
      await deleteLeilao(id);
      toast.success('Leilão excluído.');
      // remove item local e/ou refetch
      setPage(1);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Falha ao excluir.');
    }
  }

  async function onToggleAtivo(id: string) {
    try {
      await toggleAtivo(id);
      toast.success('Status atualizado.');
      setPage(1);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Falha ao atualizar.');
    }
  }

  function goDetalhes(id: string) {
    router.push(`/leiloes/${id}`);
  }

  function goEditar(id: string) {
    router.push(`/store/leiloes/${id}/editar`);
  }

  function goNovo() {
    router.push('/store/leiloes/novo');
  }

  if (!isSignedIn) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-white/80">
        Faça login para acessar os leilões.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          {subtitle ? <p className="text-white/60 mt-1">{subtitle}</p> : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSource}
            className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 text-white/90"
            title="Alternar fonte (backend/mock)"
          >
            Alternar
          </button>

          <button
            onClick={goNovo}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white"
          >
            + Novo
          </button>
        </div>
      </div>

      {/* filtros */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-5">
            <input
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-white"
              placeholder="Buscar por título, descrição ou usuário..."
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
            />
          </div>

          <div className="lg:col-span-2">
            <select
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-white"
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            >
              <option value="todos">Todos</option>
              <option value="aberto">aberto</option>
              <option value="encerrado">encerrado</option>
              <option value="cancelado">cancelado</option>
              <option value="ativo">ativo</option>
              <option value="inativo">inativo</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <select
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-white"
              value={raridade}
              onChange={(e) => { setRaridade(e.target.value); setPage(1); }}
              title="Raridade"
            >
              <option value="todos">Raridade</option>
              <option value="Comum">Comum</option>
              <option value="Incomum">Incomum</option>
              <option value="Rara">Rara</option>
              <option value="Ultra Rara">Ultra Rara</option>
              <option value="Secreta">Secreta</option>
            </select>
          </div>

          <div className="lg:col-span-3 flex gap-3 justify-end">
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">Por página:</span>
              <select
                className="rounded-xl bg-black/40 border border-white/10 px-3 py-2 outline-none focus:border-white/30 text-white"
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="lg:col-span-3">
            <select
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-white"
              value={estadoCarta}
              onChange={(e) => { setEstadoCarta(e.target.value); setPage(1); }}
              title="Estado da carta"
            >
              <option value="todos">Estado</option>
              <option value="Nova">Nova</option>
              <option value="Seminova">Seminova</option>
              <option value="Usada">Usada</option>
              <option value="Danificada">Danificada</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <input
              type="date"
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-white"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              title="De"
            />
          </div>
          <div className="lg:col-span-2">
            <input
              type="date"
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-white"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              title="Até"
            />
          </div>
        </div>

        <div className="mt-2 text-white/60 text-sm">
          {loading ? 'Carregando...' : `${total} resultado(s)`}
        </div>
      </div>

      {/* tabela */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-black/30 text-white/80">
              <tr>
                <th className="text-left px-4 py-3">Ações</th>
                <th className="text-left px-4 py-3">Título</th>
                <th className="text-left px-4 py-3">Raridade</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-left px-4 py-3">Preço inicial</th>
                <th className="text-left px-4 py-3">Preço atual</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Termina em</th>
              </tr>
            </thead>

            <tbody className="text-white/90">
              {!loading && items.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-white/60" colSpan={8}>
                    Nenhum leilão encontrado.
                  </td>
                </tr>
              ) : null}

              {items.map((l) => {
                const meta = getLeilaoMeta(l.id) || {};
                const rar = l.raridade ?? meta.raridade ?? '-';
                const est = l.estadoCarta ?? meta.estadoCarta ?? '-';

                return (
                  <tr key={l.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button className="text-white/80 hover:text-white" onClick={() => onToggleAtivo(l.id)}>
                          Alternar
                        </button>

                        <button className="text-white/80 hover:text-white" onClick={() => goDetalhes(l.id)}>
                          Detalhes
                        </button>

                        <button className="text-white/80 hover:text-white" onClick={() => goEditar(l.id)}>
                          Editar
                        </button>

                        <button className="px-2 py-1 rounded bg-red-900/60 hover:bg-red-900 text-white" onClick={() => onDelete(l.id)}>
                          Excluir
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium">{l.titulo}</div>
                      <div className="text-white/60 text-xs line-clamp-1">{l.descricao || ''}</div>
                    </td>

                    <td className="px-4 py-3">{rar}</td>
                    <td className="px-4 py-3">{est}</td>

                    <td className="px-4 py-3">{toMoney(l.precoInicial)}</td>
                    <td className="px-4 py-3">{toMoney(l.precoAtual)}</td>
                    <td className="px-4 py-3">{String(l.status ?? '-')}</td>
                    <td className="px-4 py-3">{toDateTime(l.terminaEm)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* paginação */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 text-white/70 text-sm">
          <div>Página {page} de {totalPages}</div>

          <div className="flex gap-2">
            <button
              className="px-3 py-2 rounded-xl border border-white/10 hover:border-white/20 disabled:opacity-40"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </button>

            <button
              className="px-3 py-2 rounded-xl border border-white/10 hover:border-white/20 disabled:opacity-40"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

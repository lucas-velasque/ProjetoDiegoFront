'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

import type { Leilao, LeilaoStatus } from '@/lib/services/leiloes.client';
import { canEdit, deleteLeilao, listLeiloes, updateLeilao } from '@/lib/services/leiloes.client';

function formatMoney(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

type Props = {
  mode: 'admin' | 'user';
  title?: string;
};

export default function LeiloesListClient({ mode, title }: Props) {
  const router = useRouter();
  const { user } = useUser();

  // ID do usuário no backend (tabela users.id). É salvo pelo componente UserSync em localStorage.
  const [backendUserId, setBackendUserId] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = window.localStorage.getItem('backend_user_id');
    if (id) setBackendUserId(id);
  }, [user?.id]);

  // se o Clerk não estiver resolvido, cai em mock fixo
  const userId = (backendUserId ?? user?.id) ?? 'user_mock_1';
  const userNome = user?.fullName ?? user?.username ?? user?.primaryEmailAddress?.emailAddress ?? 'Usuário';
  const isAdmin = mode === 'admin';

  const [q, setQ] = useState('');
  const [status, setStatus] = useState<LeilaoStatus | 'todos'>('todos');
  const [terminaDe, setTerminaDe] = useState('');
  const [terminaAte, setTerminaAte] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Leilao[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const scope = isAdmin ? 'all' : 'mine';

  const params = useMemo(() => ({
    q,
    status,
    terminaDe,
    terminaAte,
    page,
    limit,
    scope: scope as 'all' | 'mine',
    ownerId: userId,
  }), [q, status, terminaDe, terminaAte, page, limit, scope, userId]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await listLeiloes(params);
      // Quando usamos API, ownerId vira o vendedorId (ex: "1"). Para o modo usuário,
      // filtramos por backend_user_id quando disponível.
      const filtered = (!isAdmin && backendUserId)
        ? res.items.filter((l) => String(l.ownerId) === String(backendUserId))
        : res.items;
      setItems(filtered);
      setTotal((!isAdmin && backendUserId) ? filtered.length : res.total);

      setPages(res.pages);
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao carregar leilões');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  function goNew() {
    router.push(isAdmin ? '/admin/leiloes/novo' : '/store/leiloes/novo');
  }

  function goEdit(id: string) {
    router.push(isAdmin ? `/admin/leiloes/${id}/editar` : `/store/leiloes/${id}/editar`);
  }

  async function onDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este leilão?')) return;
    await deleteLeilao(id);
    await load();
  }

  async function onToggleStatus(l: Leilao) {
    const next = l.status === 'ativo' ? 'cancelado' : 'ativo';
    if (!confirm(`Tem certeza que deseja alterar o status para ${next}?`)) return;
    await updateLeilao(l.id, { status: next });
    await load();
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">{title ?? 'Leilões'}</h1>
          <p className="text-sm text-gray-300">
            {isAdmin
              ? 'Gerenciando todos os leilões do sistema'
              : 'Gerenciar seus leilões.'}
          </p>
        </div>

        <button
          onClick={goNew}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
        >
          + Novo
        </button>
      </div>

      <div className="bg-black/30 border border-white/10 rounded-xl p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            value={q}
            onChange={(e) => { setPage(1); setQ(e.target.value); }}
            placeholder="Buscar por título, descrição ou usuário..."
            className="md:col-span-2 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white outline-none"
          />

          <select
            value={status}
            onChange={(e) => { setPage(1); setStatus(e.target.value as any); }}
            className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white outline-none"
          >
            <option value="todos">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="finalizado">Finalizados</option>
            <option value="cancelado">Cancelados</option>
          </select>

          <input
            type="date"
            value={terminaDe}
            onChange={(e) => { setPage(1); setTerminaDe(e.target.value); }}
            className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white outline-none"
            title="Termina a partir de"
          />

          <input
            type="date"
            value={terminaAte}
            onChange={(e) => { setPage(1); setTerminaAte(e.target.value); }}
            className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white outline-none"
            title="Termina até"
          />
        </div>

        <div className="flex items-center justify-between mt-3 text-sm text-gray-300">
          <div>
            {loading ? 'Carregando...' : `${total} resultado(s)`}
          </div>

          <div className="flex items-center gap-2">
            <span>Por página:</span>
            <select
              value={limit}
              onChange={(e) => { setPage(1); setLimit(Number(e.target.value)); }}
              className="px-2 py-1 rounded bg-black/40 border border-white/10 text-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200">
          {error}
        </div>
      )}

      <div className="bg-black/30 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-black/40">
              <tr className="text-left text-gray-200">
                <th className="px-4 py-3">Ações</th>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Preço inicial</th>
                <th className="px-4 py-3">Preço atual</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Termina em</th>
              </tr>
            </thead>
            <tbody className="text-gray-100">
              {items.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-gray-300">
                    Nenhum leilão encontrado.
                  </td>
                </tr>
              ) : (
                items.map((l) => {
                  const editable = canEdit(l, { isAdmin, userId });
                  return (
                    <tr key={l.id} className="border-t border-white/10">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/leiloes/${l.id}`)}
                            className="px-2 py-1 rounded bg-white/10 hover:bg-white/15"
                            title="Ver detalhes"
                          >
                            Detalhes
                          </button>

                          <button
                            onClick={() => onToggleStatus(l)}
                            className="px-2 py-1 rounded bg-white/10 hover:bg-white/15"
                            title="Alternar status"
                          >
                            Alternar
                          </button>

                          <button
                            onClick={() => editable ? goEdit(l.id) : alert('Você só pode editar seus próprios leilões.')}
                            className="px-2 py-1 rounded bg-white/10 hover:bg-white/15"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => editable ? onDelete(l.id) : alert('Você só pode excluir seus próprios leilões.')}
                            className="px-2 py-1 rounded bg-red-500/15 hover:bg-red-500/25 text-red-200"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{l.titulo}</div>
                        <div className="text-xs text-gray-300">
                          {isAdmin ? `Criado por: ${l.ownerNome}` : 'Seu leilão'}
                        </div>
                      </td>
                      <td className="px-4 py-3">{formatMoney(l.precoInicial)}</td>
                      <td className="px-4 py-3">{formatMoney(l.precoAtual)}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded bg-white/10">
                          {l.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{formatDate(l.terminaEm)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-white/10 text-sm text-gray-200">
          <div>
            Página <b>{page}</b> de <b>{pages}</b>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 rounded bg-white/10 hover:bg-white/15 disabled:opacity-50"
            >
              Anterior
            </button>

            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page >= pages}
              className="px-3 py-1 rounded bg-white/10 hover:bg-white/15 disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

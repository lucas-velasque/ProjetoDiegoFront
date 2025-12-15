'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

import type { LeilaoStatus } from '@/lib/services/leiloes.client';
import { canEdit, createLeilao, getLeilaoById, updateLeilao } from '@/lib/services/leiloes.client';

type Props = {
  mode: 'admin' | 'user';
  action: 'create' | 'edit';
};

function toIsoFromLocalDateTime(v: string) {
  const d = new Date(v);
  return d.toISOString();
}

function toInputDateTime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function LeilaoFormClient({ mode, action }: Props) {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const { user } = useUser();

  const isAdmin = mode === 'admin';
  const userId = user?.id ?? 'user_1';
  const userNome = user?.fullName ?? user?.username ?? 'Zezinho';

  const id = (params?.id as string | undefined) ?? undefined;

  const [loading, setLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState(action === 'edit');
  const [error, setError] = useState<string | null>(null);

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [precoInicial, setPrecoInicial] = useState('0.01');
  const [precoAtual, setPrecoAtual] = useState('0.01');
  const [status, setStatus] = useState<LeilaoStatus>('ativo');
  const [terminaEm, setTerminaEm] = useState(
    toInputDateTime(new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString())
  );

  useEffect(() => {
    async function load() {
      if (action !== 'edit' || !id) return;

      setLoadingItem(true);
      setError(null);
      const item = await getLeilaoById(id);

      if (!item) {
        setError('Leilão não encontrado.');
        setLoadingItem(false);
        return;
      }

      const editable = canEdit(item, { isAdmin, userId });
      if (!editable) {
        setError('Você não tem permissão para editar este leilão.');
        setLoadingItem(false);
        return;
      }

      setTitulo(item.titulo);
      setDescricao(item.descricao ?? '');
      setPrecoInicial(String(item.precoInicial));
      setPrecoAtual(String(item.precoAtual));
      setStatus(item.status);
      setTerminaEm(toInputDateTime(item.terminaEm));
      setLoadingItem(false);
    }

    load();
  }, [action, id, isAdmin, userId]);

  const backUrl = useMemo(() => (isAdmin ? '/admin/leiloes' : '/store/leiloes'), [isAdmin]);

  function validate() {
    if (!titulo.trim()) return 'Título é obrigatório.';
    const pi = Number(precoInicial);
    if (!Number.isFinite(pi) || pi < 0.01) return 'Preço inicial deve ser >= 0,01.';
    const dt = new Date(toIsoFromLocalDateTime(terminaEm)).getTime();
    if (!Number.isFinite(dt) || dt <= Date.now()) return 'Data/hora de término deve ser no futuro.';
    if (action === 'edit') {
      const pa = Number(precoAtual);
      if (!Number.isFinite(pa) || pa < 0) return 'Preço atual inválido.';
    }
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }

    setLoading(true);
    setError(null);

    try {
      if (action === 'create') {
        await createLeilao({
          titulo,
          descricao,
          precoInicial: Number(precoInicial),
          terminaEm: toIsoFromLocalDateTime(terminaEm),
          ownerId: userId,
          ownerNome: userNome,
        });
      } else {
        if (!id) throw new Error('ID inválido');
        await updateLeilao(id, {
          titulo,
          descricao,
          precoInicial: Number(precoInicial),
          precoAtual: Number(precoAtual),
          status,
          terminaEm: toIsoFromLocalDateTime(terminaEm),
        });
      }

      router.push(backUrl);
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao salvar leilão');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {action === 'create' ? 'Criar leilão' : 'Editar leilão'}
          </h1>
          <p className="text-sm text-gray-300">
            {isAdmin ? 'Admin: pode editar qualquer leilão.' : 'Usuário: pode editar apenas os próprios.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push(backUrl)}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white"
        >
          Voltar
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="bg-black/30 border border-white/10 rounded-xl p-4">
        {loadingItem ? (
          <div className="text-gray-200">Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm text-gray-200">Título *</label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white outline-none"
                placeholder="Ex: Charizard Raro 1ª Edição"
              />
            </div>

            <div>
              <label className="text-sm text-gray-200">Descrição</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white outline-none min-h-[120px]"
                placeholder="Condição, observações, detalhes..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-200">Preço inicial (R$) *</label>
                <input
                  value={precoInicial}
                  onChange={(e) => setPrecoInicial(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white outline-none"
                  inputMode="decimal"
                />
              </div>

              {action === 'edit' && (
                <div>
                  <label className="text-sm text-gray-200">Preço atual (R$)</label>
                  <input
                    value={precoAtual}
                    onChange={(e) => setPrecoAtual(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white outline-none"
                    inputMode="decimal"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-200">Termina em *</label>
                <input
                  type="datetime-local"
                  value={terminaEm}
                  onChange={(e) => setTerminaEm(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white outline-none"
                />
              </div>

              {action === 'edit' && (
                <div>
                  <label className="text-sm text-gray-200">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="mt-1 w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white outline-none"
                  >
                    <option value="ativo">ativo</option>
                    <option value="finalizado">finalizado</option>
                    <option value="cancelado">cancelado</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => router.push(backUrl)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white"
              >
                Cancelar
              </button>

              <button
                disabled={loading}
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-60"
              >
                {loading ? 'Salvando...' : (action === 'create' ? 'Criar leilão' : 'Salvar alterações')}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

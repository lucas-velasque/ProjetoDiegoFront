'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { criarMeuLeilao } from '@/lib/api/leiloesUser';

function todayPlusDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function LeilaoUsuarioNovoClient() {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [precoInicial, setPrecoInicial] = useState('');
  const [terminaEm, setTerminaEm] = useState(() => todayPlusDays(7));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit = useMemo(() => {
    if (!titulo.trim()) return false;
    const p = Number(precoInicial);
    if (!Number.isFinite(p) || p < 0) return false;
    if (!terminaEm) return false;
    return true;
  }, [titulo, precoInicial, terminaEm]);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!canSubmit) return;

    try {
      setLoading(true);
      await criarMeuLeilao({
        titulo: titulo.trim(),
        descricao: descricao.trim() || undefined,
        precoInicial: Number(precoInicial),
        terminaEm,
      });
      router.push('/store/leiloes');
    } catch (err) {
      setError(err?.message || 'Falha ao criar o leilão.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-white">Criar leilão</h1>
        <Link
          href="/store/leiloes"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
        >
          Voltar
        </Link>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="mb-1 block text-sm text-white/80">Título</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Charizard 1ª edição"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Descrição (opcional)</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Condição, observações, etc."
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-white/80">Preço inicial</label>
              <input
                value={precoInicial}
                onChange={(e) => setPrecoInicial(e.target.value)}
                inputMode="decimal"
                placeholder="0"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/20"
              />
              <p className="mt-1 text-xs text-white/50">Use ponto ou vírgula (ex: 10.50)</p>
            </div>

            <div>
              <label className="mb-1 block text-sm text-white/80">Termina em</label>
              <input
                value={terminaEm}
                onChange={(e) => setTerminaEm(e.target.value)}
                type="date"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="rounded-xl bg-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar leilão'}
            </button>
            <Link
              href="/store/leiloes"
              className="rounded-xl border border-white/10 bg-transparent px-5 py-3 text-sm text-white/80 hover:bg-white/5"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </form>

    </div>
  );
}

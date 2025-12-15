'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { obterMeuLeilao, atualizarMeuLeilao } from '@/lib/api/leiloesUser';

function toDateTimeLocalValue(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function parseBRLtoNumber(text) {
  const cleaned = String(text ?? '')
    .replace(/\s/g, '')
    .replace(/R\$/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.');
  const n = Number(cleaned);
  return Number.isNaN(n) ? 0 : n;
}

export default function LeilaoUsuarioEditarClient({ id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [precoInicialBRL, setPrecoInicialBRL] = useState('');
  const [terminaEm, setTerminaEm] = useState('');

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await obterMeuLeilao(id);
        if (!alive) return;
        setTitulo(data?.titulo ?? '');
        setDescricao(data?.descricao ?? '');
        setPrecoInicialBRL(
          typeof data?.precoInicial === 'number'
            ? data.precoInicial.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })
            : ''
        );
        setTerminaEm(toDateTimeLocalValue(data?.terminaEm));
      } catch (e) {
        if (!alive) return;
        setError(e?.message || 'Não foi possível carregar o leilão.');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  const canSubmit = useMemo(() => {
    if (!titulo.trim()) return false;
    if (!terminaEm) return false;
    return true;
  }, [titulo, terminaEm]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit || saving) return;

    try {
      setSaving(true);
      setError('');

      await atualizarMeuLeilao(id, {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        precoInicial: parseBRLtoNumber(precoInicialBRL),
        terminaEm: new Date(terminaEm).toISOString(),
      });

      router.push('/store/leiloes');
    } catch (e) {
      setError(e?.message || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Editar leilão</h1>
          <p className="text-sm text-white/60">Loja • Meus leilões</p>
        </div>
        <Link
          href="/store/leiloes"
          className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
        >
          Voltar
        </Link>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        {loading ? (
          <div className="text-sm text-white/70">Carregando...</div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-white/70">Título</label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-white/20"
                placeholder="Ex: Charizard 1ª Edição"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-white/70">Descrição</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="min-h-[110px] w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-white/20"
                placeholder="Detalhes do item, condição, observações..."
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-white/70">Preço inicial</label>
                <input
                  value={precoInicialBRL}
                  onChange={(e) => setPrecoInicialBRL(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-white/20"
                  placeholder="R$ 0,00"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-white/70">Termina em</label>
                <input
                  type="datetime-local"
                  value={terminaEm}
                  onChange={(e) => setTerminaEm(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-white/20"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={!canSubmit || saving}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
              <Link
                href="/store/leiloes"
                className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
              >
                Cancelar
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

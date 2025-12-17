'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

import { createLeilao, updateLeilao } from '@/lib/services/leiloes.client';
import { setLeilaoMeta } from '@/lib/services/leiloes.meta';

type Props = {
  mode: 'create' | 'edit';
  leilaoId?: string;
  initial?: {
    titulo?: string;
    descricao?: string;
    precoInicial?: number;
    terminaEm?: string;
    status?: string;
    raridade?: string;
    estadoCarta?: string;
  };
};

const RARIDADES = ['Comum', 'Incomum', 'Rara', 'Ultra Rara', 'Secreta'];
const ESTADOS = ['Nova', 'Seminova', 'Usada', 'Danificada'];

function toInputDatetimeLocal(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  // yyyy-MM-ddThh:mm
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromInputDatetimeLocal(v: string) {
  // treat as local time
  const d = new Date(v);
  return d.toISOString();
}

function getBackendUserId(): number | undefined {
  if (typeof window === 'undefined') return undefined;
  const raw = window.localStorage.getItem('backend_user_id');
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : undefined;
}

export default function LeilaoFormClient({ mode, leilaoId, initial }: Props) {
  const router = useRouter();
  const { user } = useUser();

  const [titulo, setTitulo] = useState(initial?.titulo ?? '');
  const [descricao, setDescricao] = useState(initial?.descricao ?? '');
  const [precoInicial, setPrecoInicial] = useState(String(initial?.precoInicial ?? ''));
  const [terminaEm, setTerminaEm] = useState(toInputDatetimeLocal(initial?.terminaEm) || '');
  const [raridade, setRaridade] = useState(initial?.raridade ?? '');
  const [estadoCarta, setEstadoCarta] = useState(initial?.estadoCarta ?? '');

  const disabled = useMemo(() => {
    return !titulo.trim() || !precoInicial || !terminaEm;
  }, [titulo, precoInicial, terminaEm]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;

    const backendUserId = getBackendUserId();
    if (!backendUserId) {
      toast.error('Usuário ainda não sincronizado com o backend. Recarregue a página e tente de novo.');
      return;
    }

    const preco = Number(String(precoInicial).replace(',', '.'));
    if (!Number.isFinite(preco) || preco <= 0) {
      toast.error('Preço inicial inválido.');
      return;
    }

    try {
      if (mode === 'create') {
        const created = await createLeilao({
          titulo: titulo.trim(),
          descricao,
          precoInicial: preco,
          terminaEm: fromInputDatetimeLocal(terminaEm),
          status: 'aberto',
          valor_incremento: 1,
          vendedorId: backendUserId, // garante integer no banco
          ownerId: user?.id,         // usado só no mock
          ownerNome: user?.fullName ?? user?.username ?? 'Usuário',
          raridade,
          estadoCarta,
        });

        if (created?.id) {
          setLeilaoMeta(created.id, { raridade, estadoCarta });
        }

        toast.success('Leilão criado!');
        router.push('/store/leiloes');
        router.refresh();
      } else {
        if (!leilaoId) throw new Error('ID do leilão não informado.');

        const updated = await updateLeilao(leilaoId, {
          titulo: titulo.trim(),
          descricao,
          precoInicial: preco,
          terminaEm: fromInputDatetimeLocal(terminaEm),
          raridade,
          estadoCarta,
        });

        if (updated?.id) {
          setLeilaoMeta(updated.id, { raridade, estadoCarta });
        }

        toast.success('Leilão atualizado!');
        router.push('/store/leiloes');
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Falha ao salvar leilão.');
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl w-full">
      <div className="bg-[#0b0f15] rounded-2xl border border-white/10 p-8 shadow-xl">
        <div className="grid gap-6">
          <div>
            <label className="block text-sm text-white/80 mb-2">Título *</label>
            <input
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex.: Charizard Raro 1ª Edição"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-2">Descrição</label>
            <textarea
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30 min-h-[110px]"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o produto, condição, observações..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/80 mb-2">Raridade</label>
              <select
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
                value={raridade}
                onChange={(e) => setRaridade(e.target.value)}
              >
                <option value="">Selecione...</option>
                {RARIDADES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-2">Estado da carta</label>
              <select
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
                value={estadoCarta}
                onChange={(e) => setEstadoCarta(e.target.value)}
              >
                <option value="">Selecione...</option>
                {ESTADOS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/80 mb-2">Preço inicial (R$) *</label>
              <input
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
                value={precoInicial}
                onChange={(e) => setPrecoInicial(e.target.value)}
                placeholder="0,01"
              />
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-2">Termina em *</label>
              <input
                type="datetime-local"
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
                value={terminaEm}
                onChange={(e) => setTerminaEm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-white/90"
            >
              Cancelar
            </button>

            <button
              disabled={disabled}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600"
              type="submit"
            >
              {mode === 'create' ? 'Criar leilão' : 'Salvar alterações'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

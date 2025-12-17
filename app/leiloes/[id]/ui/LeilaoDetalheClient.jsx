'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { apiClient } from '@/lib/api/client';

function toMoney(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return String(v ?? '');
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDateTime(value) {
  if (!value) return '-';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleString('pt-BR');
  } catch {
    return String(value);
  }
}

// ---- Mock data (fallback) ----
const MOCK_LEILOES = [
  {
    id: 123,
    titulo: 'Charizard Raro 1ª Edição (Mock)',
    descricao: 'Carta em ótimo estado, com pequenos sinais de uso. Envio rápido.',
    vendedor: { username: 'daniel' },
    precoInicial: 1.0,
    precoAtual: 5.75,
    status: 'ATIVO',
    terminaEm: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
    lances: [
      { id: 1, usuario: 'zezinho', valor: 2.5, createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString() },
      { id: 2, usuario: 'maria', valor: 4.0, createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
      { id: 3, usuario: 'joao', valor: 5.75, createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
    ],
  },
  {
    id: 124,
    titulo: 'Eevee (Mock)',
    descricao: 'Perfeita para coleção. Sem dobras.',
    vendedor: { username: 'lucas' },
    precoInicial: 0.5,
    precoAtual: 1.25,
    status: 'ATIVO',
    terminaEm: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    lances: [{ id: 1, usuario: 'vendedor', valor: 1.25, createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() }],
  },
];

function getMockLeilaoById(id) {
  const idStr = String(id);
const found = MOCK_LEILOES.find((x) => x.id === n);
  if (found) return found;

  // Se não existir no mock, cria um mock simples para o id pedido (pra evitar tela em branco)
  return {
    id: n || id,
    titulo: `Leilão #${id} (Mock)`,
    descricao: 'Detalhes indisponíveis. Este é um leilão mock gerado automaticamente.',
    vendedor: { username: 'usuario' },
    precoInicial: 1.0,
    precoAtual: 1.0,
    status: 'ATIVO',
    terminaEm: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    lances: [],
  };
}

function normalizeLeilao(raw, idFallback) {
  if (!raw) return null;

  // Tenta suportar nomes de campos diferentes (API/Sequelize/DTO)
  const idFromFallback = (() => {
    if (idFallback === undefined || idFallback === null) return undefined;
    if (typeof idFallback === 'number') return Number.isFinite(idFallback) ? idFallback : undefined;
    return String(idFallback);
  })();
  const id = raw.id ?? raw.leilaoId ?? idFromFallback;
  const titulo = raw.titulo ?? raw.title ?? raw.nome ?? `Leilão #${id}`;
  const descricao = raw.descricao ?? raw.description ?? raw.observacoes ?? '';

  const precoInicial =
    raw.precoInicial ??
    raw.preco_inicial ??
    raw.valor_inicial ??
    raw.precoInicial ??
    raw.preco ??
    0;

  const precoAtual =
    raw.precoAtual ??
    raw.preco_atual ??
    raw.valor_atual ??
    raw.precoAtual ??
    raw.lance_atual ??
    precoInicial;

  const status = raw.status ?? raw.situacao ?? 'ATIVO';

  const terminaEm = raw.terminaEm ?? raw.termina_em ?? raw.termino ?? raw.endAt ?? raw.fim ?? null;

  const vendedorNome =
    raw.vendedor?.username ??
    raw.vendedor?.nome ??
    raw.usuario?.username ??
    raw.usuario?.nome ??
    raw.vendedorNome ??
    '—';

  const lances = raw.lances ?? raw.bids ?? [];

  return {
    id,
    titulo,
    descricao,
    precoInicial,
    precoAtual,
    status,
    terminaEm,
    vendedorNome,
    lances,
  };
}

export default function LeilaoDetalheClient({ id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leilao, setLeilao] = useState(null);

  const [valorLance, setValorLance] = useState('');

  // Controla origem dos dados: "api" | "mock" | "auto" (default)
  const source = useMemo(() => {
    const v = (process.env.NEXT_PUBLIC_LEILOES_SOURCE || '').toLowerCase();
    if (v === 'api' || v === 'mock') return v;
    return 'auto';
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        // 1) Se pediu mock direto
        if (source === 'mock') {
          const m = getMockLeilaoById(id);
          if (!isMounted) return;
          setLeilao(normalizeLeilao(m, id));
          setLoading(false);
          return;
        }

        // 2) Tenta API
        try {
          const resp = await apiClient.get(`/leiloes/${id}`);
          const normalized = normalizeLeilao(resp?.data, id);
          if (!normalized) throw new Error('Resposta inválida da API');
          if (!isMounted) return;
          setLeilao(normalized);
          setLoading(false);
          return;
        } catch (apiErr) {
          // 3) Se auto, cai pro mock; se api, mostra erro
          if (source === 'api') throw apiErr;
          const m = getMockLeilaoById(id);
          if (!isMounted) return;
          setLeilao(normalizeLeilao(m, id));
          setLoading(false);
        }
      } catch (err) {
        if (!isMounted) return;
        setError('Não foi possível carregar o leilão.');
        setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [id, source]);

  async function onDarLance() {
    const v = Number(String(valorLance).replace(',', '.'));
    if (!v || Number.isNaN(v)) {
      alert('Informe um valor de lance válido.');
      return;
    }

    // mock: atualiza em memória
    if (source === 'mock' || (source === 'auto' && !leilao?.id)) {
      setLeilao((prev) => {
        if (!prev) return prev;
        const next = {
          ...prev,
          precoAtual: Math.max(Number(prev.precoAtual || 0), v),
          lances: [
            {
              id: (prev.lances?.length || 0) + 1,
              usuario: 'você',
              valor: v,
              createdAt: new Date().toISOString(),
            },
            ...(prev.lances || []),
          ],
        };
        return next;
      });
      setValorLance('');
      return;
    }

    // api: tenta endpoint (se estiver funcionando)
    try {
      await apiClient.post(`/leiloes/${id}/lances`, { valor: v });
      // Recarrega detalhes
      const resp = await apiClient.get(`/leiloes/${id}`);
      setLeilao(normalizeLeilao(resp?.data, id));
      setValorLance('');
    } catch (err) {
      alert('Não foi possível registrar o lance (verifique autenticação e a API).');
    }
  }

  async function onEncerrar() {
    if (!confirm('Tem certeza que deseja encerrar este leilão?')) return;

    if (source === 'mock') {
      setLeilao((prev) => (prev ? { ...prev, status: 'FINALIZADO' } : prev));
      return;
    }

    try {
      await apiClient.patch(`/leiloes/${id}/encerrar`);
      const resp = await apiClient.get(`/leiloes/${id}`);
      setLeilao(normalizeLeilao(resp?.data, id));
    } catch (err) {
      alert('Não foi possível encerrar o leilão (verifique autenticação e a API).');
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Leilão</h1>
            <p className="text-sm text-white/70">Detalhes do leilão {id ? `#${id}` : ''}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              Voltar
            </button>
            <Link
              href="/store/leiloes"
              className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              Meus leilões
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-6 w-2/3 rounded bg-white/10" />
              <div className="mt-3 h-4 w-1/2 rounded bg-white/10" />
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="h-20 rounded bg-white/10" />
                <div className="h-20 rounded bg-white/10" />
                <div className="h-20 rounded bg-white/10" />
              </div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
          ) : !leilao ? (
            <div className="text-sm text-white/70">Leilão não encontrado.</div>
          ) : (
            <>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{leilao.titulo}</h2>
                  <p className="mt-1 text-sm text-white/70">Vendedor: {leilao.vendedorNome}</p>
                </div>

                <div className="inline-flex items-center gap-2">
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs">{String(leilao.status)}</span>
                </div>
              </div>

              {leilao.descricao ? <p className="mt-4 text-sm text-white/80">{leilao.descricao}</p> : null}

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs text-white/60">Preço inicial</div>
                  <div className="mt-1 text-lg font-semibold">{toMoney(leilao.precoInicial)}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs text-white/60">Preço atual</div>
                  <div className="mt-1 text-lg font-semibold">{toMoney(leilao.precoAtual)}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs text-white/60">Termina em</div>
                  <div className="mt-1 text-lg font-semibold">{formatDateTime(leilao.terminaEm)}</div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold">Dar lance</div>
                    <div className="text-xs text-white/60">Informe um valor maior que o lance atual.</div>
                  </div>

                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                    <input
                      value={valorLance}
                      onChange={(e) => setValorLance(e.target.value)}
                      placeholder="Ex: 9,90"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/40 focus:border-white/20 sm:w-44"
                    />
                    <button
                      onClick={onDarLance}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
                    >
                      Dar lance
                    </button>
                    <button
                      onClick={onEncerrar}
                      className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
                    >
                      Encerrar
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-sm font-semibold">Lances recentes</div>

                <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-xs text-white/70">
                      <tr>
                        <th className="px-4 py-3">Usuário</th>
                        <th className="px-4 py-3">Valor</th>
                        <th className="px-4 py-3">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {(leilao.lances || []).length === 0 ? (
                        <tr>
                          <td className="px-4 py-4 text-white/70" colSpan={3}>
                            Nenhum lance ainda.
                          </td>
                        </tr>
                      ) : (
                        (leilao.lances || []).slice(0, 10).map((l) => (
                          <tr key={l.id ?? `${l.usuario}-${l.createdAt}`}> 
                            <td className="px-4 py-3">{l.usuario ?? l.user ?? '—'}</td>
                            <td className="px-4 py-3">{toMoney(l.valor ?? l.value)}</td>
                            <td className="px-4 py-3 text-white/70">{formatDateTime(l.createdAt ?? l.data ?? l.created_at)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export type LeilaoStatus = 'ativo' | 'finalizado' | 'cancelado';

export type LeilaoMock = {
  id: string;
  titulo: string;
  descricao?: string;
  precoInicial: number;
  precoAtual: number;
  status: LeilaoStatus;
  terminaEm: string; // ISO
  criadoEm: string;  // ISO
  ownerId: string;
  ownerNome: string;
};

export const MOCK_STORAGE_KEY = 'poketrade_leiloes_mock_v1';

/**
 * Seed inicial para quando não existir nada no localStorage.
 * Dica: o admin vê todos; o usuário verá/editará apenas os próprios (ownerId).
 */
export const seedLeiloes: LeilaoMock[] = [
  {
    id: 'l_1001',
    titulo: 'Charizard Base Set (Shadowless)',
    descricao: 'Carta em ótimo estado. Leve desgaste nas bordas.',
    precoInicial: 10.00,
    precoAtual: 23.50,
    status: 'ativo',
    terminaEm: new Date(Date.now() + 1000 * 60 * 60 * 7).toISOString(),
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    ownerId: 'user_mock_1',
    ownerNome: 'Zezinho',
  },
  {
    id: 'l_1002',
    titulo: 'Pikachu Promo (Edição Especial)',
    descricao: 'Promo rara. Excelente para coleção.',
    precoInicial: 0.01,
    precoAtual: 2.75,
    status: 'ativo',
    terminaEm: new Date(Date.now() + 1000 * 60 * 60 * 28).toISOString(),
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    ownerId: 'user_mock_2',
    ownerNome: 'Ramon',
  },
  {
    id: 'l_1003',
    titulo: 'Eevee (Common) - Lote com 10',
    descricao: 'Lote com 10 Eevees comuns, ideal para deck.',
    precoInicial: 5.00,
    precoAtual: 5.00,
    status: 'finalizado',
    terminaEm: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    ownerId: 'user_mock_1',
    ownerNome: 'Zezinho',
  },
  {
    id: 'l_1004',
    titulo: 'Mewtwo EX',
    descricao: 'Carta forte. Pequena marca no canto.',
    precoInicial: 15.00,
    precoAtual: 15.00,
    status: 'cancelado',
    terminaEm: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    ownerId: 'user_mock_3',
    ownerNome: 'Stephani',
  },
];

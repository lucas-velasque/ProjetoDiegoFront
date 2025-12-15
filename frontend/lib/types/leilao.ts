export type StatusLeilao = "aberto" | "encerrado" | string;

export interface Leilao {
  id: string;
  titulo: string;
  descricao?: string;
  status: StatusLeilao;

  precoInicial: number | string;
  precoAtual: number | string;
  valor_incremento?: number | string;

  terminaEm?: string; // ISO
  ativo?: boolean;

  vendedorId?: number;
  categoriaLeilaoId?: number | null;
  ganhadorId?: number | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface Paginated<T> {
  items: T[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ListarLeiloesParams {
  page?: number;
  limit?: number;
  titulo?: string;
  status?: string;
  vendedorId?: number;
  ganhadorId?: number;
  ativo?: boolean;
}

export interface CriarLeilaoInput {
  titulo: string;
  descricao?: string;
  status: StatusLeilao;

  precoInicial: number;
  precoAtual: number;
  valor_incremento: number;

  terminaEm: string; // ISO
  vendedorId: number;

  categoriaLeilaoId?: number | null;
}

export type AtualizarLeilaoInput = Partial<
  Omit<CriarLeilaoInput, "vendedorId"> & {
    vendedorId?: number;
    ativo?: boolean;
    ganhadorId?: number | null;
  }
>;

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  items?: T extends any[] ? T : never;
  error?: string;
  statusCode?: number;
}

// ==================== PAGINATION ====================
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ==================== USER ====================
export interface User {
  id: number;
  nome: string;
  username: string;
  email: string;
  nivel_usuario_id: number;
  pontuacao: number;
  status: 'ativo' | 'inativo' | 'bloqueado';
  created_at?: string;
  updated_at?: string;
  nivelUsuario?: NivelUsuario;
}

export interface CreateUserDto {
  nome: string;
  username: string;
  email: string;
  senha: string;
  nivel_usuario_id?: number;
}

export interface UpdateUserDto {
  nome?: string;
  username?: string;
  email?: string;
  senha?: string;
  nivel_usuario_id?: number;
  pontuacao?: number;
  status?: 'ativo' | 'inativo' | 'bloqueado';
}

export interface FiltroUserDto {
  nome?: string;
  username?: string;
  email?: string;
  status?: 'ativo' | 'inativo' | 'bloqueado';
  nivel_usuario_id?: number;
  pontuacao_min?: number;
  pontuacao_max?: number;
  data_inicio?: string;
  data_fim?: string;
  page?: number;
  limit?: number;
}

// ==================== NIVEL USUARIO ====================
export interface NivelUsuario {
  id: number;
  nome: string;
  descricao?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateNivelUsuarioDto {
  nome: string;
  descricao?: string;
}

export interface UpdateNivelUsuarioDto {
  nome?: string;
  descricao?: string;
}

// ==================== CARTA ====================
export interface Carta {
  id: number;
  nome: string;
  tipo: string;
  raridade: string;
  descricao?: string;
  pontos_ataque?: number;
  pontos_saude?: number;
  categoria_id?: number;
  custo_mana?: number;
  elemento?: string;
  expansao?: string;
  numero_colecao?: string;
  imagem_url?: string;
  preco_medio?: number;
  created_at?: string;
  updated_at?: string;
  categoria?: CategoriaCartas;
}

export interface CreateCartaDto {
  nome: string;
  tipo: string;
  raridade: string;
  descricao?: string;
  pontos_ataque?: number;
  pontos_saude?: number;
  categoria_id?: number;
  custo_mana?: number;
  elemento?: string;
  expansao?: string;
  numero_colecao?: string;
  imagem_url?: string;
  preco_medio?: number;
}

export interface UpdateCartaDto {
  nome?: string;
  tipo?: string;
  raridade?: string;
  descricao?: string;
  pontos_ataque?: number;
  pontos_saude?: number;
  categoria_id?: number;
  custo_mana?: number;
  elemento?: string;
  expansao?: string;
  numero_colecao?: string;
  imagem_url?: string;
  preco_medio?: number;
}

export interface FiltroCartaDto {
  nome?: string;
  tipo?: string;
  raridade?: string;
  categoria_id?: number;
  elemento?: string;
  expansao?: string;
  pontos_ataque_min?: number;
  pontos_ataque_max?: number;
  pontos_saude_min?: number;
  pontos_saude_max?: number;
  custo_mana_min?: number;
  custo_mana_max?: number;
  preco_min?: number;
  preco_max?: number;
  data_inicio?: string;
  data_fim?: string;
  page?: number;
  limit?: number;
}

// ==================== CATEGORIA CARTAS ====================
export interface CategoriaCartas {
  id: number;
  nome: string;
  descricao?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCategoriaCartasDto {
  nome: string;
  descricao?: string;
}

export interface UpdateCategoriaCartasDto {
  nome?: string;
  descricao?: string;
}

// ==================== CATEGORIA LEILAO ====================
export interface CategoriaLeilao {
  id: number;
  nome: string;
  descricao?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCategoriaLeilaoDto {
  nome: string;
  descricao?: string;
}

export interface UpdateCategoriaLeilaoDto {
  nome?: string;
  descricao?: string;
}

// ==================== ANUNCIO VENDA ====================
export interface AnuncioVendaCarta {
  id?: number;
  anuncio_venda_id?: number;
  carta_id: number;
  quantidade: number;
  condicao?: string;
  observacoes?: string;
  carta?: Carta;
}

export interface AnuncioVenda {
  id: number;
  usuario_id: number;
  titulo: string;
  descricao?: string;
  preco_total: number;
  quantidade_disponivel: number;
  status: 'ativo' | 'vendido' | 'cancelado';
  created_at?: string;
  updated_at?: string;
  usuario?: User;
  cartas?: AnuncioVendaCarta[];
}

export interface CreateAnuncioVendaDto {
  titulo: string;
  descricao?: string;
  preco_total: number;
  quantidade_disponivel: number;
  cartas: {
    carta_id: number;
    quantidade: number;
    condicao?: string;
    observacoes?: string;
  }[];
}

export interface UpdateAnuncioVendaDto {
  titulo?: string;
  descricao?: string;
  preco_total?: number;
  quantidade_disponivel?: number;
  status?: 'ativo' | 'vendido' | 'cancelado';
}

export interface FiltroAnuncioVendaDto {
  nome_carta?: string;
  usuario_id?: number;
  status?: 'ativo' | 'vendido' | 'cancelado';
  preco_min?: number;
  preco_max?: number;
  condicao?: string;
  raridade?: string;
  data_inicio?: string;
  data_fim?: string;
  page?: number;
  limit?: number;
}

// ==================== ANUNCIO COMPRA ====================
export interface AnuncioCompra {
  id: number;
  usuario_id: number;
  nome_carta: string;
  expansao?: string;
  numero_expansao?: string;
  raridade?: string;
  edicao?: string;
  quantidade: number;
  preco_maximo?: number;
  condicao_minima?: string;
  tipos?: string[];
  variacao?: string;
  descricao?: string;
  status: 'ativo' | 'finalizado' | 'cancelado';
  created_at?: string;
  updated_at?: string;
  usuario?: User;
}

export interface CreateAnuncioCompraDto {
  nome_carta: string;
  expansao?: string;
  numero_expansao?: string;
  raridade?: string;
  edicao?: string;
  quantidade: number;
  preco_maximo?: number;
  condicao_minima?: string;
  tipos?: string[];
  variacao?: string;
  descricao?: string;
}

export interface UpdateAnuncioCompraDto {
  nome_carta?: string;
  expansao?: string;
  numero_expansao?: string;
  raridade?: string;
  edicao?: string;
  quantidade?: number;
  preco_maximo?: number;
  condicao_minima?: string;
  tipos?: string[];
  variacao?: string;
  descricao?: string;
  status?: 'ativo' | 'finalizado' | 'cancelado';
}

export interface FiltroAnuncioCompraDto {
  nome_carta?: string;
  usuario_id?: number;
  status?: 'ativo' | 'finalizado' | 'cancelado';
  preco_min?: number;
  preco_max?: number;
  raridade?: string;
  edicao?: string;
  condicao_minima?: string;
  data_inicio?: string;
  data_fim?: string;
  page?: number;
  limit?: number;
}

// ==================== PROPOSTA ====================
export interface Proposta {
  id: number;
  usuario_id: number;
  anuncio_id: number;
  valor_oferta: number;
  status: 'pendente' | 'aceita' | 'recusada' | 'cancelada';
  mensagem?: string;
  created_at?: string;
  updated_at?: string;
  usuario?: User;
  anuncio?: AnuncioVenda;
}

export interface CreatePropostaDto {
  usuario_id: number;
  anuncio_id: number;
  valor_oferta: number;
  mensagem?: string;
}

export interface UpdatePropostaDto {
  valor_oferta?: number;
  status?: 'pendente' | 'aceita' | 'recusada' | 'cancelada';
  mensagem?: string;
}

export interface FiltroPropostaDto {
  usuario_id?: number;
  anuncio_id?: number;
  status?: 'pendente' | 'aceita' | 'recusada' | 'cancelada';
  valor_min?: number;
  valor_max?: number;
  data_inicio?: string;
  data_fim?: string;
  page?: number;
  limit?: number;
}

// ==================== LEILAO ====================
export interface Leilao {
  id: number;
  titulo: string;
  descricao?: string;
  usuario_id: number;
  carta_id: number;
  categoria_id?: number;
  lance_inicial: number;
  lance_atual?: number;
  data_inicio: string;
  data_termino: string;
  status: 'ativo' | 'finalizado' | 'cancelado';
  created_at?: string;
  updated_at?: string;
  usuario?: User;
  carta?: Carta;
  categoria?: CategoriaLeilao;
}

export interface CreateLeilaoDto {
  titulo: string;
  descricao?: string;
  usuario_id: number;
  carta_id: number;
  categoria_id?: number;
  lance_inicial: number;
  data_inicio: string;
  data_termino: string;
}

export interface UpdateLeilaoDto {
  titulo?: string;
  descricao?: string;
  lance_inicial?: number;
  lance_atual?: number;
  data_inicio?: string;
  data_termino?: string;
  status?: 'ativo' | 'finalizado' | 'cancelado';
}

export interface FiltroLeilaoDto {
  titulo?: string;
  status?: 'ativo' | 'finalizado' | 'cancelado';
  categoria_id?: number;
  lance_inicial_min?: number;
  lance_inicial_max?: number;
  data_inicio?: string;
  data_fim?: string;
  data_termino_inicio?: string;
  data_termino_fim?: string;
  page?: number;
  limit?: number;
}

// ==================== COMENTARIO ====================
export interface Comentario {
  id: number;
  usuario_id: number;
  texto: string;
  entity_id: number;
  entity_type: 'anuncio_venda' | 'anuncio_compra' | 'leilao' | 'proposta';
  status: 'ativo' | 'deletado';
  created_at?: string;
  updated_at?: string;
  usuario?: User;
}

export interface CreateComentarioDto {
  usuario_id: number;
  texto: string;
  entity_id: number;
  entity_type: 'anuncio_venda' | 'anuncio_compra' | 'leilao' | 'proposta';
}

export interface UpdateComentarioDto {
  texto?: string;
  status?: 'ativo' | 'deletado';
}

export interface FiltroComentarioDto {
  usuario_id?: number;
  entity_id?: number;
  entity_type?: 'anuncio_venda' | 'anuncio_compra' | 'leilao' | 'proposta';
  status?: 'ativo' | 'deletado';
  data_inicio?: string;
  data_fim?: string;
  page?: number;
  limit?: number;
}

// ==================== AUTH ====================
export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

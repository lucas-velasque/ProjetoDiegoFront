import LeilaoDetalheClient from './ui/LeilaoDetalheClient';

export default async function Page({ params }) {
  // Next 15: `params` pode vir como Promise em rotas dinâmicas (Turbopack)
  const { id } = await params;
  return <LeilaoDetalheClient id={id} />;
}

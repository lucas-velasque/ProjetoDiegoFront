import LeilaoUsuarioEditarClient from './ui/LeilaoUsuarioEditarClient';

export const metadata = {
  title: 'Editar leilão | Loja',
};

export default function EditarLeilaoPage({ params }) {
  return <LeilaoUsuarioEditarClient id={params?.id} />;
}

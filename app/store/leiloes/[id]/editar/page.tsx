'use client';

import LeilaoFormClient from '@/components/leiloes/LeilaoFormClient';

export default function StoreEditarLeilaoPage() {
  return (
    <div className="p-6">
      <LeilaoFormClient mode="user" action="edit" />
    </div>
  );
}

'use client';

import LeilaoFormClient from '@/components/leiloes/LeilaoFormClient';

export default function StoreNovoLeilaoPage() {
  return (
    <div className="p-6">
      <LeilaoFormClient mode="user" action="create" />
    </div>
  );
}

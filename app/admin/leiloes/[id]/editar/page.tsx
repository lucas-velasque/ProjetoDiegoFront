'use client';

import LeilaoFormClient from '@/components/leiloes/LeilaoFormClient';

export default function AdminEditarLeilaoPage() {
  return (
    <div className="p-6">
      <LeilaoFormClient mode="admin" action="edit" />
    </div>
  );
}

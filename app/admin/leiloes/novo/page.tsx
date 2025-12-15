'use client';

import LeilaoFormClient from '@/components/leiloes/LeilaoFormClient';

export default function AdminNovoLeilaoPage() {
  return (
    <div className="p-6">
      <LeilaoFormClient mode="admin" action="create" />
    </div>
  );
}

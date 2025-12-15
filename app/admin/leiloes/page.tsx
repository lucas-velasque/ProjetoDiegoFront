'use client';

import LeiloesListClient from '@/components/leiloes/LeiloesListClient';

export default function AdminLeiloesPage() {
  return (
    <div className="p-6">
      <LeiloesListClient mode="admin" title="Leilões (Admin)" />
    </div>
  );
}

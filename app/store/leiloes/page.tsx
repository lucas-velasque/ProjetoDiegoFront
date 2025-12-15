'use client';

import LeiloesListClient from '@/components/leiloes/LeiloesListClient';

export default function StoreLeiloesPage() {
  return (
    <div className="p-6">
      <LeiloesListClient mode="user" title="Meus Leilões" />
    </div>
  );
}

"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

export default function UserSync() {
  const { user, isLoaded, isSignedIn } = useUser();
  const syncedRef = useRef(false);

  useEffect(() => {
    // Sincronizar usuário com o backend quando ele fizer login
    const syncUser = async () => {
      if (isLoaded && isSignedIn && user && !syncedRef.current) {
        syncedRef.current = true;
        
        try {
          console.log('Sincronizando usuário com backend...', user.id);
          
          const response = await fetch('/api/sync-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Usuário sincronizado:', data);
            // Salva o ID do usuário no banco (users.id) para filtrar "Meus leilões" no front.
            try {
              const id = data?.user?.id ?? data?.id;
              if (typeof window !== 'undefined' && id) {
                window.localStorage.setItem('backend_user_id', String(id));
              }
            } catch {}
          } else {
            const error = await response.json().catch(() => ({}));
            console.error('Erro ao sincronizar usuário:', error);
          }
        } catch (error) {
          console.error('Erro na sincronização:', error);
        }
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user]);

  // Este componente não renderiza nada visualmente
  return null;
}

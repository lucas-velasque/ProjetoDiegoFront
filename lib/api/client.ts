import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função helper para obter token do Clerk
async function getClerkToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    // Tentar obter o token do Clerk via window.__clerk_session_token
    // ou através do método getToken se disponível
    const clerk = (window as any).Clerk;
    if (clerk?.session) {
      return await clerk.session.getToken();
    }
  } catch (error) {
    console.error('Erro ao obter token do Clerk:', error);
  }

  // Fallback: tentar localStorage (para compatibilidade com sistema antigo)
  return localStorage.getItem('token');
}

// Interceptor para adicionar JWT do Clerk automaticamente
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getClerkToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erro global
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido - não redirecionar se estiver usando Clerk
      if (typeof window !== 'undefined') {
        const clerk = (window as any).Clerk;
        if (!clerk) {
          // Só redirecionar se não estiver usando Clerk
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

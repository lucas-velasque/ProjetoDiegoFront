import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';

export interface AdminUser {
  id: number;
  nome: string;
  username: string;
  email: string;
  nivel_usuario_id: number;
  pontuacao: number;
  status: 'ativo' | 'inativo' | 'bloqueado';
  created_at?: string;
  updated_at?: string;
}

export interface AdminAuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAdminAuth() {
  const router = useRouter();
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Verificar se há token armazenado ao carregar
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admin_token');
      const user = localStorage.getItem('admin_user');

      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          setState({
            user: parsedUser,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } else {
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await apiClient.post('/auth/login', {
          username,
          password,
        });

        const { access_token, user } = response.data;

        // Verificar se o usuário é admin (nivel_usuario_id = 1 ou role = admin)
        // Você pode ajustar essa lógica conforme necessário
        if (!user || user.nivel_usuario_id !== 1) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Acesso negado. Apenas administradores podem acessar.',
          }));
          return false;
        }

        // Armazenar token e usuário
        localStorage.setItem('admin_token', access_token);
        localStorage.setItem('admin_user', JSON.stringify(user));

        // Atualizar estado
        setState({
          user,
          token: access_token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return true;
      } catch (error: any) {
        let errorMessage = 'Erro ao fazer login';

        if (error.response?.status === 401) {
          errorMessage = 'Usuário ou senha incorretos';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        return false;
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    router.push('/admin/login');
  }, [router]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    logout,
    clearError,
  };
}

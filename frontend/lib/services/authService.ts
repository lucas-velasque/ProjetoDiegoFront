import { authApi } from '@/lib/api/auth';
import { LoginDto, CreateUserDto } from '@/types';
import { toast } from 'sonner';

export const authService = {
  login: async (data: LoginDto) => {
    // Validações de negócio
    if (!data.username || data.username.trim() === '') {
      toast.error('Username é obrigatório');
      throw new Error('Username inválido');
    }

    if (!data.password || data.password.trim() === '') {
      toast.error('Senha é obrigatória');
      throw new Error('Senha inválida');
    }

    try {
      const response = await authApi.login(data);
      toast.success('Login realizado com sucesso!');
      return response;
    } catch (error) {
      toast.error('Credenciais inválidas');
      throw error;
    }
  },

  register: async (data: CreateUserDto) => {
    // Validações de negócio
    if (!data.nome || data.nome.trim() === '') {
      toast.error('Nome é obrigatório');
      throw new Error('Nome inválido');
    }

    if (!data.email || !data.email.includes('@')) {
      toast.error('Email inválido');
      throw new Error('Email inválido');
    }

    if (!data.senha || data.senha.length < 6) {
      toast.error('Senha deve ter no mínimo 6 caracteres');
      throw new Error('Senha inválida');
    }

    try {
      const user = await authApi.register(data);
      toast.success('Cadastro realizado com sucesso!');
      return user;
    } catch (error) {
      toast.error('Erro ao realizar cadastro');
      throw error;
    }
  },

  logout: () => {
    authApi.logout();
    toast.info('Logout realizado com sucesso');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  getProfile: async () => {
    try {
      const profile = await authApi.getProfile();
      return profile;
    } catch (error) {
      toast.error('Erro ao carregar perfil');
      throw error;
    }
  },

  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  },
};

# 🔐 Guia de Autenticação para Administradores

**Data**: 14 de Dezembro de 2024  
**Projeto**: Projeto Diego  
**Versão**: 1.0

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquivos Criados](#arquivos-criados)
3. [Instalação](#instalação)
4. [Como Funciona](#como-funciona)
5. [Fluxo de Autenticação](#fluxo-de-autenticação)
6. [Uso](#uso)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Sistema de autenticação para administradores que:

- ✅ Protege a rota `/admin` com login obrigatório
- ✅ Armazena token em localStorage
- ✅ Valida se o usuário é administrador
- ✅ Redireciona para login se não autenticado
- ✅ Fornece navbar com logout
- ✅ Gerencia estado de autenticação globalmente

---

## 📦 Arquivos Criados

### 1. **useAdminAuth.ts** - Hook de Autenticação
```
lib/hooks/useAdminAuth.ts
```

**Responsabilidades**:
- Gerenciar estado de autenticação
- Fazer login
- Fazer logout
- Verificar se está autenticado
- Armazenar/recuperar token e usuário

**Exports**:
```typescript
export function useAdminAuth() {
  return {
    user: AdminUser | null,
    token: string | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    error: string | null,
    login: (username: string, password: string) => Promise<boolean>,
    logout: () => void,
    clearError: () => void,
  };
}
```

---

### 2. **admin-login-page.tsx** - Tela de Login
```
app/admin/login/page.tsx
```

**Responsabilidades**:
- Exibir formulário de login
- Validar campos
- Chamar hook `useAdminAuth` para fazer login
- Redirecionar se já autenticado
- Mostrar erros

**Features**:
- ✅ Campo de username
- ✅ Campo de senha com mostrar/ocultar
- ✅ Validação de campos
- ✅ Mensagem de erro
- ✅ Loading state
- ✅ Credenciais de teste

---

### 3. **AdminProtectedRoute.tsx** - Wrapper de Proteção
```
components/AdminProtectedRoute.tsx
```

**Responsabilidades**:
- Verificar autenticação
- Redirecionar para login se não autenticado
- Mostrar loading enquanto verifica
- Renderizar conteúdo se autenticado

**Uso**:
```typescript
<AdminProtectedRoute>
  {/* Conteúdo protegido */}
</AdminProtectedRoute>
```

---

### 4. **admin-layout.tsx** - Layout Admin
```
app/admin/layout.tsx
```

**Responsabilidades**:
- Envolver todas as rotas `/admin` com proteção
- Incluir navbar
- Aplicar estilos globais

---

### 5. **AdminNavbar.tsx** - Navbar Admin
```
components/AdminNavbar.tsx
```

**Responsabilidades**:
- Exibir nome do usuário
- Mostrar menu de navegação
- Fornecer botão de logout
- Exibir informações do admin

**Features**:
- ✅ Logo e título
- ✅ Links de navegação
- ✅ Informações do usuário
- ✅ Menu dropdown
- ✅ Botão de logout

---

## 🚀 Instalação

### Passo 1: Criar Estrutura de Pastas

```bash
# Criar pastas necessárias
mkdir -p ProjetoDiegoFront/lib/hooks
mkdir -p ProjetoDiegoFront/components
mkdir -p ProjetoDiegoFront/app/admin/login
```

### Passo 2: Copiar Arquivos

```bash
# Hook de autenticação
cp useAdminAuth.ts ProjetoDiegoFront/lib/hooks/

# Componente de proteção
cp AdminProtectedRoute.tsx ProjetoDiegoFront/components/

# Navbar
cp AdminNavbar.tsx ProjetoDiegoFront/components/

# Tela de login
cp admin-login-page.tsx ProjetoDiegoFront/app/admin/login/page.tsx

# Layout admin
cp admin-layout.tsx ProjetoDiegoFront/app/admin/layout.tsx
```

### Passo 3: Atualizar Estrutura

Sua estrutura deve ficar assim:

```
ProjetoDiegoFront/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Novo
│   │   ├── login/
│   │   │   └── page.tsx        # Novo
│   │   ├── Categoria_carta/
│   │   │   └── page.tsx        # Existente
│   │   ├── leiloes/
│   │   │   └── page.tsx        # Existente
│   │   └── page.jsx            # Existente (dashboard)
│   └── ...
├── components/
│   ├── AdminProtectedRoute.tsx # Novo
│   ├── AdminNavbar.tsx         # Novo
│   └── ...
├── lib/
│   ├── hooks/
│   │   ├── useAdminAuth.ts     # Novo
│   │   └── ...
│   └── ...
└── ...
```

---

## 🔄 Como Funciona

### 1. Fluxo de Login

```
Usuário acessa /admin
    ↓
AdminProtectedRoute verifica autenticação
    ↓
Não autenticado? → Redireciona para /admin/login
    ↓
Usuário preenche formulário
    ↓
Clica em "Entrar no Painel"
    ↓
useAdminAuth.login() é chamado
    ↓
POST /auth/login é enviado
    ↓
Backend valida credenciais
    ↓
Sucesso? → Token + User retornados
    ↓
Token armazenado em localStorage
    ↓
Redireciona para /admin
    ↓
AdminProtectedRoute verifica → Autenticado ✅
    ↓
Renderiza conteúdo
```

### 2. Verificação de Autenticação

```
useAdminAuth hook é inicializado
    ↓
useEffect busca token em localStorage
    ↓
Token encontrado?
    ├─ Sim → Restaura usuário e token
    └─ Não → Estado vazio
    ↓
isAuthenticated = true/false
```

### 3. Logout

```
Usuário clica em "Sair"
    ↓
logout() é chamado
    ↓
localStorage é limpo
    ↓
Estado é resetado
    ↓
Redireciona para /admin/login
```

---

## 📊 Fluxo de Autenticação

### Diagrama Completo

```
┌─────────────────────────────────────────────────────────┐
│ Usuário acessa http://localhost:3001/admin              │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ AdminProtectedRoute verifica autenticação               │
│ - Busca token em localStorage                           │
│ - Verifica isAuthenticated                              │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   Autenticado?           Não autenticado?
        │                     │
        ▼                     ▼
   Renderiza            Redireciona para
   Dashboard            /admin/login
        │                     │
        │                     ▼
        │            ┌─────────────────────────┐
        │            │ Tela de Login           │
        │            │ - Username              │
        │            │ - Senha                 │
        │            │ - Botão Entrar          │
        │            └────────┬────────────────┘
        │                     │
        │                     ▼
        │            ┌─────────────────────────┐
        │            │ Usuário preenche dados  │
        │            │ e clica em "Entrar"     │
        │            └────────┬────────────────┘
        │                     │
        │                     ▼
        │            ┌─────────────────────────┐
        │            │ POST /auth/login        │
        │            │ {                       │
        │            │   username: "admin"     │
        │            │   password: "admin123"  │
        │            │ }                       │
        │            └────────┬────────────────┘
        │                     │
        │         ┌───────────┴───────────┐
        │         │                       │
        │         ▼                       ▼
        │      Sucesso (200)          Erro (401)
        │         │                       │
        │         ▼                       ▼
        │    Token recebido          Mostrar erro
        │    User recebido           "Credenciais
        │         │                   inválidas"
        │         ▼
        │    Armazenar em
        │    localStorage
        │         │
        │         ▼
        │    Redirecionar
        │    para /admin
        │         │
        └─────────┘
             │
             ▼
    ┌─────────────────────────┐
    │ AdminProtectedRoute      │
    │ verifica novamente       │
    │ isAuthenticated = true ✅ │
    └────────┬────────────────┘
             │
             ▼
    ┌─────────────────────────┐
    │ AdminNavbar renderiza   │
    │ - Nome do usuário       │
    │ - Menu de navegação     │
    │ - Botão de logout       │
    └────────┬────────────────┘
             │
             ▼
    ┌─────────────────────────┐
    │ Dashboard Admin         │
    │ (conteúdo protegido)    │
    └─────────────────────────┘
```

---

## 💻 Uso

### 1. Acessar Painel Admin

```
http://localhost:3001/admin
```

Se não autenticado, será redirecionado para:
```
http://localhost:3001/admin/login
```

### 2. Fazer Login

**Credenciais de Teste**:
- Username: `admin`
- Senha: `admin123`

**Ou use suas credenciais reais** (usuário com `nivel_usuario_id = 1`)

### 3. Usar Hook em Componentes

```typescript
'use client';

import { useAdminAuth } from '@/lib/hooks/useAdminAuth';

export function MeuComponente() {
  const { user, isAuthenticated, logout } = useAdminAuth();

  return (
    <div>
      {isAuthenticated && (
        <>
          <p>Bem-vindo, {user?.nome}!</p>
          <button onClick={logout}>Sair</button>
        </>
      )}
    </div>
  );
}
```

### 4. Proteger Rotas

```typescript
// app/admin/minha-rota/page.tsx
'use client';

import { AdminProtectedRoute } from '@/components/AdminProtectedRoute';

export default function MinhaRotaAdmin() {
  return (
    <AdminProtectedRoute>
      <div>
        {/* Conteúdo protegido */}
      </div>
    </AdminProtectedRoute>
  );
}
```

---

## 🔍 Verificação de Admin

O sistema verifica se o usuário é administrador comparando:

```typescript
// No hook useAdminAuth.ts
if (!user || user.nivel_usuario_id !== 1) {
  // Acesso negado
}
```

**Você pode ajustar essa lógica** conforme necessário:

```typescript
// Exemplo: Verificar role
if (!user || user.role !== 'admin') {
  // Acesso negado
}

// Exemplo: Verificar múltiplas roles
if (!user || !['admin', 'super_admin'].includes(user.role)) {
  // Acesso negado
}
```

---

## 🛠️ Troubleshooting

### Problema 1: "Acesso negado. Apenas administradores podem acessar."

**Causa**: O usuário não tem `nivel_usuario_id = 1`

**Solução**:
1. Verifique se o usuário é admin no banco de dados
2. Ou ajuste a verificação no `useAdminAuth.ts`

```typescript
// Mudar de:
if (!user || user.nivel_usuario_id !== 1) {

// Para:
if (!user) {
  // Apenas verificar se existe usuário
}
```

---

### Problema 2: Token não está sendo armazenado

**Causa**: localStorage pode estar desabilitado ou há erro na resposta

**Solução**:
1. Verifique se localStorage está habilitado
2. Verifique a resposta da API em Network tab
3. Verifique se o token está sendo retornado

---

### Problema 3: Redireciona para login mesmo autenticado

**Causa**: Token expirou ou foi removido

**Solução**:
1. Faça login novamente
2. Verifique se o token está em localStorage
3. Verifique se a API está retornando token válido

---

### Problema 4: Navbar não aparece

**Causa**: AdminNavbar não está sendo importado

**Solução**:
1. Verifique se `AdminNavbar` está em `components/`
2. Verifique se está importado em `admin-layout.tsx`
3. Verifique se o layout está sendo usado

---

## 📝 Checklist de Implementação

- [ ] Criar pasta `lib/hooks/`
- [ ] Copiar `useAdminAuth.ts` para `lib/hooks/`
- [ ] Criar pasta `components/` (se não existir)
- [ ] Copiar `AdminProtectedRoute.tsx` para `components/`
- [ ] Copiar `AdminNavbar.tsx` para `components/`
- [ ] Criar pasta `app/admin/login/`
- [ ] Copiar `admin-login-page.tsx` para `app/admin/login/page.tsx`
- [ ] Copiar `admin-layout.tsx` para `app/admin/layout.tsx`
- [ ] Testar acesso a `/admin` (deve redirecionar para `/admin/login`)
- [ ] Testar login com credenciais válidas
- [ ] Testar logout
- [ ] Verificar se token é armazenado em localStorage
- [ ] Testar acesso a `/admin` após login (deve funcionar)
- [ ] Testar logout (deve redirecionar para `/admin/login`)

---

## 🎯 Próximos Passos

1. **Implementar refresh de token**
   - Adicionar lógica para renovar token antes de expirar

2. **Adicionar permissões granulares**
   - Verificar permissões específicas por rota

3. **Adicionar auditoria**
   - Registrar login/logout de admins

4. **Implementar 2FA (Two-Factor Authentication)**
   - Adicionar camada extra de segurança

---

## 📚 Referências

- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [React Hooks](https://react.dev/reference/react/hooks)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

## ✅ Conclusão

Agora você tem um sistema de autenticação completo para administradores com:

- ✅ Login seguro
- ✅ Proteção de rotas
- ✅ Gerenciamento de estado
- ✅ Navbar com logout
- ✅ Validação de permissões

Boa sorte! 🚀


import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // Preparar dados do usuário
    const userData = {
      clerk_id: user.id,
      email: user.emailAddresses[0]?.emailAddress || `${user.id}@clerk.user`,
      nome: [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Usuário',
      username: user.username || user.emailAddresses[0]?.emailAddress?.split('@')[0] || user.id,
      senha: '', // Clerk gerencia a senha
      status: 'ativo',
    };

    console.log('Sincronizando usuário com backend:', userData);

    // Tentar criar o usuário no backend
    const response = await fetch(`${apiUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Usuário criado/sincronizado com sucesso:', data);
      return NextResponse.json({ success: true, user: data });
    }

    // Se o usuário já existe (409 Conflict), consideramos sucesso
    if (response.status === 409) {
      console.log('Usuário já existe no backend');
      return NextResponse.json({ success: true, message: 'Usuário já existe' });
    }

    const errorData = await response.json().catch(() => ({}));
    console.error('Erro ao sincronizar usuário:', errorData);
    return NextResponse.json(
      { error: 'Erro ao sincronizar usuário', details: errorData },
      { status: response.status }
    );
  } catch (error) {
    console.error('Erro na sincronização:', error);
    return NextResponse.json(
      { error: 'Erro interno ao sincronizar usuário' },
      { status: 500 }
    );
  }
}

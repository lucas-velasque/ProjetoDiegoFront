'use client';

import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import Link from 'next/link';
import { useState } from 'react';

export function AdminNavbar() {
  const { user, logout } = useAdminAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Projeto Diego</h1>
              <p className="text-xs text-gray-500">Painel Administrativo</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/admin"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/Categoria_carta"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Categorias
            </Link>
            <Link
              href="/admin/leiloes"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Leilões
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.nome}</p>
                  <p className="text-xs text-gray-500">Administrador</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {user.nome.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/Categoria_carta"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Categorias de Cartas
                  </Link>
                  <Link
                    href="/admin/leiloes"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Leilões
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={() => {
                      logout();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition font-medium"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

'use client';

import { useState } from 'react';
import { useNiveisUsuario } from '@/lib/hooks/useCategorias';
import { NivelUsuario } from '@/types';

export default function NiveisUsuarioPage() {
  const {
    niveis,
    loading,
    createNivel,
    updateNivel,
    deleteNivel,
  } = useNiveisUsuario();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<NivelUsuario | null>(null);
  const [formData, setFormData] = useState({ nome: '', descricao: '' });

  const handleAdd = () => {
    setEditing(null);
    setFormData({ nome: '', descricao: '' });
    setShowModal(true);
  };

  const handleEdit = (nivel: NivelUsuario) => {
    setEditing(nivel);
    setFormData({ nome: nivel.nome, descricao: nivel.descricao || '' });
    setShowModal(true);
  };

  const handleDelete = async (nivel: NivelUsuario) => {
    if (confirm(`Tem certeza que deseja excluir o nível "${nivel.nome}"?`)) {
      await deleteNivel(nivel.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateNivel(editing.id, formData);
    } else {
      await createNivel(formData);
    }
    setShowModal(false);
  };

  return (
    <div className="p-12 max-w-7xl mx-auto text-black w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
          Níveis de Usuário
        </h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          + Adicionar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-600"></div>
          </div>
        ) : niveis.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Nenhum nível encontrado
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-gray-700 text-sm bg-gray-50">
                <th className="p-4 text-left">Nome</th>
                <th className="p-4 text-left">Descrição</th>
                <th className="p-4 text-center w-40">Ações</th>
              </tr>
            </thead>
            <tbody>
              {niveis.map((nivel) => (
                <tr
                  key={nivel.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="p-4">{nivel.nome}</td>
                  <td className="p-4">{nivel.descricao || '-'}</td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(nivel)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(nivel)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {editing ? 'Editar Nível' : 'Novo Nível'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  {editing ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

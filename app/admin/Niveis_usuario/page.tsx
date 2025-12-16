"use client";

import { useState, useEffect } from "react";
import { XIcon, SquarePenIcon, PlusIcon, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { nivelUsuarioService } from "@/lib/services/nivelUsuarioService";
import { NivelUsuario, UpdateNivelUsuarioDto } from "@/types";

export default function UserLevels() {
  const router = useRouter();
  const [levels, setLevels] = useState<NivelUsuario[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [editing, setEditing] = useState<NivelUsuario | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Delay na busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadLevels = async () => {
    setIsLoading(true);
    try {
      const response = await nivelUsuarioService.getAll({
        nome: search,
        page,
        limit: itemsPerPage,
      });

      setLevels(response);
      setTotalPages(1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLevels();
  }, [page, search]);

  const openEdit = (level: NivelUsuario) => {
    setEditing({ ...level });
    setShowModal(true);
  };

  const closeModal = () => {
    setEditing(null);
    setShowModal(false);
  };

  const saveEdit = async () => {
    if (!editing) return;

    const updateData: UpdateNivelUsuarioDto = {
      nome: editing.nome,
      descricao: editing.descricao,
      corIdentificacao: editing.corIdentificacao,
      pontuacaoMinima: editing.pontuacaoMinima,
    };

    try {
      await nivelUsuarioService.update(editing.id, updateData);
      closeModal();
      loadLevels();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteLevel = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esse nível?")) return;
    try {
      await nivelUsuarioService.delete(id);
      loadLevels();
    } catch (error) {
      console.error(error);
    }
  };

  const addLevel = () => {
    router.push("/admin/cad_nivel_usuario");
  };

  return (
    <div className="p-12 max-w-7xl mx-auto text-black w-full">
      <div className="flex justify-end mb-4">
        <button
          onClick={addLevel}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
        >
          <PlusIcon size={18} />
          Adicionar
        </button>
      </div>

      <h1 className="text-3xl font-semibold text-gray-800 mb-6 tracking-tight">
        Níveis de usuário
      </h1>

      <div className="relative mb-6 w-full max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Buscar níveis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-gray-700 text-sm bg-gray-50">
              <th className="p-4 w-12"></th>
              <th className="p-4 w-12"></th>
              <th className="p-4 text-left">Nome</th>
              <th className="p-4 text-left">Descrição</th>
              <th className="p-4 text-left">Cor</th>
              <th className="p-4 text-center w-32">Pontuação</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  Carregando...
                </td>
              </tr>
            ) : levels.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  Nenhum nível encontrado.
                </td>
              </tr>
            ) : (
              levels.map((lvl) => (
                <tr
                  key={lvl.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="p-4">
                    <button
                      onClick={() => deleteLevel(lvl.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <XIcon size={20} />
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => openEdit(lvl)}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <SquarePenIcon size={20} />
                    </button>
                  </td>
                  <td className="p-4">{lvl.nome}</td>
                  <td className="p-4">{lvl.descricao}</td>
                  <td className="p-4">{lvl.corIdentificacao}</td>
                  <td className="p-4 text-center">{lvl.pontuacaoMinima}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex justify-center gap-3 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded-lg border ${
            page === 1
              ? "bg-gray-100 text-gray-400"
              : "bg-white hover:bg-gray-100 text-gray-800"
          }`}
        >
          Anterior
        </button>

        <span className="px-4 py-2 text-gray-700">
          Página {page} de {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded-lg border ${
            page === totalPages
              ? "bg-gray-100 text-gray-400"
              : "bg-white hover:bg-gray-100 text-gray-800"
          }`}
        >
          Próxima
        </button>
      </div>

      {/* Modal de edição */}
      {showModal && editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Editar Nível
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nome</label>
                <input
                  type="text"
                  value={editing.nome}
                  onChange={(e) =>
                    setEditing({ ...editing, nome: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  value={editing.descricao}
                  onChange={(e) =>
                    setEditing({ ...editing, descricao: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Cor</label>
                <input
                  type="text"
                  value={editing.corIdentificacao}
                  onChange={(e) =>
                    setEditing({ ...editing, corIdentificacao: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Pontuação Mínima
                </label>
                <input
                  type="number"
                  value={editing.pontuacaoMinima}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      pontuacaoMinima: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={closeModal}
                className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Cancelar
              </button>

              <button
                onClick={saveEdit}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

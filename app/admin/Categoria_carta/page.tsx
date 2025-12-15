"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { XIcon, SquarePenIcon, PlusIcon, Search } from "lucide-react";
import { categoriaCartasApi } from "@/lib/api/categoriaCartas";
import { CategoriaCartas } from "@/types";

export default function CategoryList() {
  const router = useRouter();

  const [categories, setCategories] = useState<CategoriaCartas[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [editing, setEditing] = useState<CategoriaCartas | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const loadCategories = async () => {
    try {
      const response = await categoriaCartasApi.getAll({
        page,
        limit: itemsPerPage,
        nome: search || undefined,
      });
      setCategories(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Erro ao carregar categorias", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [page, search]);

  const openEdit = (category: CategoriaCartas) => {
    setEditing({ ...category });
    setShowModal(true);
  };

  const closeModal = () => {
    setEditing(null);
    setShowModal(false);
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await categoriaCartasApi.update(editing.id, {
        nome: editing.nome,
        tipo: editing.tipo,
        descricao: editing.descricao,
        status: editing.status,
      });
      loadCategories();
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao salvar edição", error);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;
    try {
      await categoriaCartasApi.delete(id);
      loadCategories();
    } catch (error) {
      console.error("Erro ao excluir categoria", error);
    }
  };

  const filteredData = categories.filter((cat) =>
    cat.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-12 max-w-7xl mx-auto text-black w-full">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => router.push("/admin/cad_categoria_carta")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
        >
          <PlusIcon size={18} />
          Adicionar
        </button>
      </div>

      <h1 className="text-3xl font-semibold text-gray-800 mb-6 tracking-tight">
        Categorias de cartas
      </h1>

      <div className="relative mb-6 w-full max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Buscar categorias..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
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
              <th className="p-4 text-left">Tipo</th>
              <th className="p-4 text-left">Descrição</th>
              <th className="p-4 text-center w-32">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  Nenhuma categoria encontrada.
                </td>
              </tr>
            )}
            {filteredData.map((cat) => (
              <tr
                key={cat.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="p-4">
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <XIcon size={20} />
                  </button>
                </td>

                <td className="p-4">
                  <button
                    onClick={() => openEdit(cat)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <SquarePenIcon size={20} />
                  </button>
                </td>

                <td className="p-4">{cat.nome}</td>
                <td className="p-4">{cat.tipo}</td>
                <td className="p-4">{cat.descricao}</td>
                <td className="p-4 text-center">{cat.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      {showModal && editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Editar categoria
            </h2>

            <div className="space-y-5">
              {(["name", "type", "description", "status"] as const).map(
                (field) => (
                  <div key={field}>
                    <label className="block text-sm text-gray-600 mb-1 capitalize">
                      {field}
                    </label>
                    <input
                      type="text"
                      value={editing[field]}
                      onChange={(e) =>
                        setEditing({ ...editing, [field]: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm"
                    />
                  </div>
                )
              )}
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

"use client";

import { useState } from "react";
import { XIcon, SquarePenIcon, PlusIcon, Search } from "lucide-react";
import Link from "next/link";

export default function UserLevels() {
  const CORES = {
    Branco: 100,
    Cinza: 200,
    Verde: 300,
    Azul: 400,
    Roxo: 500,
    Vermelho: 600,
    Preto: 700,
    Bronze: 800,
    Prata: 900,
    Ouro: 1000,
  };

  const coresLista = Object.keys(CORES);

  const initialData = coresLista.map((cor, index) => ({
    id: index + 1,
    name: `Nível ${index + 1}`,
    description: `Nível de usuário cor ${cor}`,
    cor: cor,
    pontuacao: CORES[cor],
  }));

  const [categories, setCategories] = useState(initialData);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const filteredData = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const openEdit = (category) => {
    setEditing({ ...category });
    setShowModal(true);
  };

  const closeModal = () => {
    setEditing(null);
    setShowModal(false);
  };

  const saveEdit = () => {
    const updated = {
      ...editing,
      pontuacao: CORES[editing.cor],
    };
    setCategories((prev) =>
      prev.map((cat) => (cat.id === editing.id ? updated : cat))
    );
    setShowModal(false);
    alert("Nível atualizado!");
  };

  const deleteCategory = (id) => {
    if (confirm("Tem certeza que deseja excluir esse nível?")) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      alert("Nível excluído!");
    }
  };

  return (
    <div className="p-12 max-w-7xl mx-auto text-black w-full">
      {/* Botão Adicionar com Link */}
      <div className="flex justify-end mb-4">
        <Link href="/admin/cad_nivel_usuario">
          <button
            onClick={() => {
              const defaultCor = "Branco";
              const newCategory = {
                id: categories.length + 1,
                name: `Nível ${categories.length + 1}`,
                description: "Novo nível de usuário",
                cor: defaultCor,
                pontuacao: CORES[defaultCor],
              };
              setCategories([...categories, newCategory]); // adiciona antes do redirecionamento
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
          >
            <PlusIcon size={18} />
            Adicionar
          </button>
        </Link>
      </div>

      <h1 className="text-3xl font-semibold text-gray-800 mb-6 tracking-tight">
        Níveis de usuário
      </h1>

      {/* Busca */}
      <div className="relative mb-6 w-full max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Buscar níveis..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
        />
      </div>

      {/* Tabela */}
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
            <tr>
              <td colSpan={6} className="border-b-2 border-black"></td>
            </tr>

            {paginatedData.map((cat) => (
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

                <td className="p-4">{cat.name}</td>
                <td className="p-4">{cat.description}</td>
                <td className="p-4">{cat.cor}</td>
                <td className="p-4 text-center">{cat.pontuacao}</td>
              </tr>
            ))}
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
          Página {page} de {Math.ceil(filteredData.length / itemsPerPage)}
        </span>

        <button
          disabled={page === Math.ceil(filteredData.length / itemsPerPage)}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded-lg border ${
            page === Math.ceil(filteredData.length / itemsPerPage)
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
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
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
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Cor</label>
                <select
                  value={editing.cor}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      cor: e.target.value,
                      pontuacao: CORES[e.target.value],
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm"
                >
                  {coresLista.map((cor) => (
                    <option key={cor} value={cor}>
                      {cor}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Pontuação
                </label>
                <input
                  type="number"
                  value={CORES[editing.cor]}
                  disabled
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm bg-gray-100"
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

"use client";
import { useState } from "react";

export default function CreateCategory() {
  const [category, setCategory] = useState({
    name: "",
    type: "",
    description: "",
    status: "",
  });

  const existingCategories = [
    {
      name: "Antiguidades",
      type: "Premium",
      description: "Itens raros",
      status: "Ativo",
    },
    {
      name: "Eletrônicos",
      type: "Padrão",
      description: "Produtos gerais",
      status: "Inativo",
    },
  ];

  const handleChange = (field, value) => {
    setCategory({ ...category, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!category.name.trim()) {
      alert("Por favor, preencha o campo Nome.");
      return;
    }
    if (!category.type.trim()) {
      alert("Por favor, preencha o campo Tipo.");
      return;
    }
    if (!category.description.trim()) {
      alert("Por favor, preencha o campo Descrição.");
      return;
    }
    if (!category.status.trim()) {
      alert("Por favor, preencha o campo Status.");
      return;
    }

    if (
      existingCategories.some(
        (c) => c.name.toLowerCase() === category.name.toLowerCase()
      )
    ) {
      alert("Já existe uma categoria com este Nome.");
      return;
    }

    if (
      existingCategories.some(
        (c) => c.type.toLowerCase() === category.type.toLowerCase()
      )
    ) {
      alert("Já existe uma categoria com este Tipo.");
      return;
    }

    if (
      existingCategories.some(
        (c) =>
          c.description.toLowerCase() === category.description.toLowerCase()
      )
    ) {
      alert("Já existe uma categoria com esta Descrição.");
      return;
    }

    if (
      existingCategories.some(
        (c) => c.status.toLowerCase() === category.status.toLowerCase()
      )
    ) {
      alert("Já existe uma categoria com este Status.");
      return;
    }

    console.log("Categoria criada:", category);
    alert("Categoria criada com sucesso!");

    setCategory({
      name: "",
      type: "",
      description: "",
      status: "",
    });
  };

  return (
    <div className="p-12 text-black w-full max-w-3xl">
      <h1 className="text-3xl font-semibold mb-10">Categorias de leilões</h1>

      <h2 className="text-lg mb-8">Criar categorias leilões</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium mb-2">Nome</label>
          <input
            type="text"
            value={category.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Informe o nome"
            className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tipo</label>
          <input
            type="text"
            value={category.type}
            onChange={(e) => handleChange("type", e.target.value)}
            placeholder="Informe o tipo"
            className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <input
            type="text"
            value={category.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Informe a descrição"
            className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <input
            type="text"
            value={category.status}
            onChange={(e) => handleChange("status", e.target.value)}
            placeholder="Informe o status"
            className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-400 text-white py-2 rounded-full text-center hover:bg-cyan-500 transition"
        >
          Ok
        </button>
      </form>
    </div>
  );
}

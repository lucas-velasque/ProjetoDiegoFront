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
    { name: "Iniciante", description: "10", status: "Azul" },
    { name: "Intermediário", description: "20", status: "Verde" },
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
      alert("Por favor, preencha o campo Descrição.");
      return;
    }
    if (!category.description.trim()) {
      alert("Por favor, preencha o campo Pontuação.");
      return;
    }
    if (!category.status.trim()) {
      alert("Por favor, preencha o campo Cor.");
      return;
    }

    if (
      existingCategories.some(
        (c) => c.name.toLowerCase() === category.name.toLowerCase()
      )
    ) {
      alert("Já existe um nível com este Nome.");
      return;
    }

    if (
      existingCategories.some(
        (c) =>
          c.description.toLowerCase() === category.description.toLowerCase()
      )
    ) {
      alert("Já existe um nível com esta Pontuação.");
      return;
    }

    if (
      existingCategories.some(
        (c) => c.status.toLowerCase() === category.status.toLowerCase()
      )
    ) {
      alert("Já existe um nível com esta Cor.");
      return;
    }

    console.log("Categoria criada:", category);
    alert("Nível criado com sucesso!");

    setCategory({
      name: "",
      type: "",
      description: "",
      status: "",
    });
  };

  return (
    <div className="p-12 text-black w-full max-w-3xl">
      <h1 className="text-3xl font-semibold mb-10">Criar níveis usuários</h1>

      <h2 className="text-lg mb-8">Criar níveis</h2>

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
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <input
            type="text"
            value={category.type}
            onChange={(e) => handleChange("type", e.target.value)}
            placeholder="Informe a descrição"
            className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Pontuação</label>
          <input
            type="text"
            value={category.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Informe a pontuação"
            className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cor</label>
          <input
            type="text"
            value={category.status}
            onChange={(e) => handleChange("status", e.target.value)}
            placeholder="Informe a cor"
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

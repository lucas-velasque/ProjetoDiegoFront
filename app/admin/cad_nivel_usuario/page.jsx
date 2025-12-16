"use client";

import { useState } from "react";
import { nivelUsuarioService } from "@/lib/services/nivelUsuarioService";
import { toast } from "sonner";

export default function CreateLevel() {
  const [level, setLevel] = useState({
    nome: "",
    descricao: "",
    corIdentificacao: "",
    pontuacaoMinima: "",
    id_cor: "",
  });

  const handleChange = (field, value) => {
    setLevel({ ...level, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const key in level) {
      if (!level[key].toString().trim()) {
        toast.error(`Por favor, preencha o campo ${key}`);
        return;
      }
    }

    try {
      const resposta = await nivelUsuarioService.create({
        nome: level.nome,
        descricao: level.descricao,
        corIdentificacao: level.corIdentificacao,
        pontuacaoMinima: Number(level.pontuacaoMinima),
        id_cor: Number(level.id_cor),
      });

      toast.success(resposta.mensagem || "Nível criado com sucesso!");

      setLevel({
        nome: "",
        descricao: "",
        corIdentificacao: "",
        pontuacaoMinima: "",
        id_cor: "",
      });
    } catch (error) {
      console.error("Erro ao criar nível:", error);
      toast.error(error?.response?.data?.message || "Erro ao criar nível");
    }
  };

  return (
    <div className="p-12 text-black w-full max-w-3xl">
      <h1 className="text-3xl font-semibold mb-10">Criar Nível de Usuário</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Nome</label>
          <input
            type="text"
            value={level.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            placeholder="Informe o nome"
            className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <input
            type="text"
            value={level.descricao}
            onChange={(e) => handleChange("descricao", e.target.value)}
            placeholder="Informe a descrição"
            className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Cor de Identificação
          </label>
          <input
            type="text"
            value={level.corIdentificacao}
            onChange={(e) => handleChange("corIdentificacao", e.target.value)}
            placeholder="Informe a cor de identificação"
            className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Pontuação Mínima
          </label>
          <input
            type="number"
            value={level.pontuacaoMinima}
            onChange={(e) => handleChange("pontuacaoMinima", e.target.value)}
            placeholder="Informe a pontuação mínima"
            className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">ID da Cor</label>
          <input
            type="number"
            value={level.id_cor}
            onChange={(e) => handleChange("id_cor", e.target.value)}
            placeholder="Informe o ID da cor"
            className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-400 text-white py-2 rounded-full text-center hover:bg-cyan-500 transition"
        >
          ok
        </button>
      </form>
    </div>
  );
}

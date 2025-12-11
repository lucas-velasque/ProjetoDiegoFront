"use client";
import React from "react";
import { ArrowRight } from "lucide-react";

const Title = () => {
  const href = "/shop";
  const visibleButton = true;

  return (
    <div className="flex flex-col items-center w-full px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
          A JORNADA COMEÇA COM UM CLIQUE: COMPRE AGORA!
        </h1>
      </div>

      <div className="mb-8 text-center w-full max-w-2xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
          Escolha sua carta
        </h2>
      </div>

      <div className="mb-8 text-center max-w-md">
        <p className="text-lg text-slate-600">Filtre pela categoria</p>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-center mb-6">
        <a
          href="/shop"
          className="px-6 py-3 rounded-full bg-blue-100 text-blue-600 font-semibold hover:bg-blue-200 hover:text-blue-700 transition duration-300 ease-in-out"
        >
          Raras
        </a>

        <a
          href="/shop"
          className="px-6 py-3 rounded-full bg-blue-100 text-blue-600 font-semibold hover:bg-blue-200 hover:text-blue-700 transition duration-300 ease-in-out"
        >
          Ultra raras
        </a>

        <a
          href="/shop"
          className="px-6 py-3 rounded-full bg-blue-100 text-blue-600 font-semibold hover:bg-blue-200 hover:text-blue-700 transition duration-300 ease-in-out"
        >
          Incomuns
        </a>

        <a
          href="/shop"
          className="px-6 py-3 rounded-full bg-blue-100 text-blue-600 font-semibold hover:bg-blue-200 hover:text-blue-700 transition duration-300 ease-in-out"
        >
          Comuns
        </a>
      </div>

      {href && visibleButton && (
        <div className="w-full flex justify-center mt-8">
          <a
            href={href}
            className="flex items-center gap-1 text-blue-500 hover:underline"
          >
            Ver todos os produtos <ArrowRight size={16} />
          </a>
        </div>
      )}
    </div>
  );
};

export default Title;

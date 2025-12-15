"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Title = ({
  title, // JSX ou string para o título
  description, // JSX ou string para a descrição
  button = null, // JSX opcional para botão customizado
  href = "", // Link padrão do botão
  visibleButton = true,
  className = "", // Classe opcional para customização externa
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Título */}
      {title && <div className="mb-2">{title}</div>}

      {/* Descrição */}
      {description && <div className="mb-2 text-center">{description}</div>}

      {/* Botão */}
      {button
        ? button
        : href &&
          visibleButton && (
            <Link
              href={href}
              className="flex items-center gap-1 text-green-500 mt-2 hover:underline"
            >
              Ver mais
              <ArrowRight size={14} />
            </Link>
          )}
    </div>
  );
};

export default Title;

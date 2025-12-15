import React from "react";
import Title from "./Title";
import Image from "next/image";

import registroImg from "@/assets/registro.png";
import compraImg from "@/assets/compra.png";
import pagamentoImg from "@/assets/pagamento.png";
import relaxeImg from "@/assets/relaxe.png";

const ourSpecsData = [
  {
    title: "REGISTRE-SE",
    description:
      "Crie uma conta com a gente é rápido e fácil. Não precisamos de mais informações além do mínimo necessário para que você possa fazer um pedido e receber seu produto.",
    image: registroImg,
  },
  {
    title: "COMPRA",
    description:
      "Decida o que deseja comprar e adicione ao seu carrinho. Temos uma grande variedade de produtos e certamente haverá algo para todos os gostos.",
    image: compraImg,
  },
  {
    title: "PAGAMENTO",
    description:
      "Pague com segurança. Nosso site possui certificados de proteção robustos para manter os dados do seu cartão e informações relacionadas a trsansações em segurança.",
    image: pagamentoImg,
  },
  {
    title: "RELAXE",
    description:
      "Seu produto será embalado e nós lhe forneceremos o código de rastreio para que você possa acompanhar seu pedido em todas as etapas.",
    image: relaxeImg,
  },
];

const OurSpecs = () => {
  return (
    <div className="w-full bg-black py-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <Title
          visibleButton={false}
          title={
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white">
              COMO COMPRAR EM NOSSO SITE?
            </h2>
          }
          description={
            <p className="text-center text-gray-300 max-w-2xl mx-auto mt-4">
              Fazer um pedido é fácil. Temos orgulho de ter tornado o processo
              acessível e simples de entender, o que significa que mais pessoas
              podem vir até nós para comprar seus produtos online.
            </p>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-16">
          {ourSpecsData.map((spec, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center px-6 p-6"
            >
              <div className="text-green-400 w-8 h-8 flex items-center justify-center font-bold rounded-full border border-green-400">
                {index + 1}
              </div>

              <div className="mt-5 w-32 h-32 flex items-center justify-center">
                <Image
                  src={spec.image}
                  alt={spec.title}
                  width={128}
                  height={128}
                  className="object-contain"
                />
              </div>

              <h3 className="text-white text-lg font-semibold mt-4">
                {spec.title}
              </h3>

              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                {spec.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-14">
          <a
            href="/shop"
            className="px-6 py-3 rounded-full text-black font-semibold transition"
            style={{
              backgroundColor: "#3EB489",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#5CC9A3")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#3EB489")
            }
          >
            Escolha seus produtos
          </a>
        </div>
      </div>
    </div>
  );
};

export default OurSpecs;

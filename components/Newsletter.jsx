import React from "react";
import {
  Headphones,
  ShieldCheck,
  Gift,
  Truck,
  Award,
  Handshake,
} from "lucide-react";

const features = [
  {
    icon: Headphones,
    title: "Atendimento ao cliente",
    description:
      "Seja respondendo as perguntas que você tenha antes de efetuar uma compra, auxiliando no próprio processo de compra ou levando em consideração seu feedback, temos orgulho de oferecer um atendimento ao cliente de alta qualidade que coloca você, o cliente, na posição mais importante da transação.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança",
    description:
      "Em termos de segurança, armazenamos apenas os dados necessários para que você tenha uma conta conosco e faça um pedido. Ao enviar sua encomenda, utilizamos apenas embalagens discretas e invioláveis, garantindo que o conteúdo da sua compra permaneça íntegro.",
  },
  {
    icon: Gift,
    title: "Melhor preço",
    description:
      "Ajustamos constantemente os nossos preços e produtos para garantir um equilíbrio ideal entre preço acessível e qualidade. Investimos nos melhores variedades que conseguimos encontrar e estamos sempre à procura de produtos novos, acessíveis e de alta qualidade.",
  },
  {
    icon: Truck,
    title: "Entrega segura",
    description:
      "Se o seu pedido for extraviado, roubado ou danificado durante o transporte, temos seguro que cobre esses incidentes. Além de frete grátis para toda a região sudeste com pedidos acima de R$60.",
  },
  {
    icon: Award,
    title: "Qualidade",
    description:
      "Todos os nossos produtos são validados para garantir a mais alta qualidade possível. Trabalhamos com fornecedores especializados e estamos sempre revisando os critérios de qualidade para assegurar que oferecemos apenas o melhor.",
  },
  {
    icon: Handshake,
    title: "Confiança",
    description:
      "Com mais de 2 anos de experiência no ramo, você pode ter certeza de que será bem atendido. Garantimos que seus interesses são nossa prioridade. Confira nossas avaliações.",
  },
];

const Newsletter = () => {
  return (
    <div id="sobre" className="flex flex-col items-center mx-4 my-36">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-black mb-10">
        O QUE NOS TORNA UMA LOJA CONFIÁVEL?
      </h2>

      <p className="text-center text-black-300 max-w-2xl mx-auto mb-12">
        Quando se trata do que nos torna a principal loja de pokemon online do
        Rio de Janeiro, poderíamos nos estender em elogios sobre nossas
        qualidades. Em vez disso, para tornar essa informação mais clara,
        destacamos os seis recursos prioritários que, em nossa opinião, nos
        diferenciam da concorrência.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl w-full mt-12">
        {features.map(({ icon: Icon, title, description }, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-6 h-80 w-full max-w-xs mx-auto"
          >
            <Icon size={32} className="text-blue-500" />
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center my-35">
        <div
          className="rounded-xl p-8 shadow-lg w-[1150px] h-[342px] flex flex-col items-center justify-center gap-8"
          style={{
            background: "linear-gradient(135deg,#00BFFF, #3EB489)",
          }}
        >
          <h2 className="text-6xl font-extrabold text-white mb-6">
            Leilões diários
          </h2>

          <div className="flex items-center gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-2xl text-white font-semibold">
                O lance mínimo é 0,01 centavo!
              </p>
              <p className="text-2xl text-white font-semibold">
                Se você não capturar agora, outro treinador vai!
              </p>
            </div>

            <button className="font-medium bg-black text-white px-8 py-4 rounded-full text-lg hover:bg-gray-100 transition">
              Clique aqui
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;

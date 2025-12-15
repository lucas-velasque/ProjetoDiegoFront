"use client";
import { assets } from "@/assets/assets";
import Image from "next/image";
import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="w-full bg-[#3C5AA6] py-30">
      {" "}
      <div className="flex flex-col xl:flex-row items-center gap-8 max-w-7xl mx-auto px-6">
        <div className="flex-1 text-white">
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Mais que um jogo, um universo para explorar.
          </h2>

          <h4 className="text-2xl sm:text-3xl font-medium leading-relaxed mb-4">
            Cartas raras, comuns e muito mais.
          </h4>

          <h4 className="text-2xl sm:text-3xl font-medium leading-relaxed mb-6">
            Sinta a adrenalina de receber uma carta nova! Bora comprar mais uma?
          </h4>
          <Link href="/shop">
            <button className="bg-[#00004F] text-white text-sm py-3 px-10 rounded-full hover:bg-gray-200 hover:scale-105 active:scale-95 transition">
              Ver tudo
            </button>
          </Link>
        </div>

        <div className="flex-1 flex justify-end">
          <Image
            className="w-full max-w-md object-contain"
            src={assets.hero_model_img}
            alt="Figuinhas pokémon"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;

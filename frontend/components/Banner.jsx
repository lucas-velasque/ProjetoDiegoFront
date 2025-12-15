"use client";
import React from "react";

export default function Banner() {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    isOpen && (
      <div className="w-full px-6 py-0.5 font-medium text-white bg-[#00004F] relative">
        <p className="text-center text-lg">
          A loja em que cada compra é uma aventura
        </p>

        <button
          onClick={() => setIsOpen(false)}
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              y="12.532"
              width="17.498"
              height="2.1"
              rx="1.05"
              transform="rotate(-45.74 0 12.532)"
              fill="#fff"
            />
            <rect
              x="12.533"
              y="13.915"
              width="17.498"
              height="2.1"
              rx="1.05"
              transform="rotate(-135.74 12.533 13.915)"
              fill="#fff"
            />
          </svg>
        </button>
      </div>
    )
  );
}

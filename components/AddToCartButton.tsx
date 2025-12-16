"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { adicionarAoCarrinho, fetchCarrinho } from "@/lib/features/cart/cartSlice";
import { ShoppingCart, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  anuncioVendaId: number;
  quantidade?: number;
  className?: string;
  disabled?: boolean;
}

export default function AddToCartButton({
  anuncioVendaId,
  quantidade = 1,
  className = "",
  disabled = false,
}: AddToCartButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding || disabled) return;

    setIsAdding(true);
    try {
      await dispatch(adicionarAoCarrinho({ anuncioVendaId, quantidade })).unwrap();

      // Atualizar o carrinho
      await dispatch(fetchCarrinho());

      setIsAdded(true);
      toast.success("Item adicionado ao carrinho!");

      // Resetar o estado após 2 segundos
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error: any) {
      toast.error(error || "Erro ao adicionar ao carrinho");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || disabled || isAdded}
      className={`
        flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium
        transition-all duration-200 active:scale-95
        ${isAdded
          ? "bg-green-600 text-white"
          : "bg-blue-600 text-white hover:bg-blue-700"
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isAdding ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Adicionando...
        </>
      ) : isAdded ? (
        <>
          <Check className="w-5 h-5" />
          Adicionado!
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Adicionar ao Carrinho
        </>
      )}
    </button>
  );
}

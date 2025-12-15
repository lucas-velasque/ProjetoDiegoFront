"use client";

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, CreditCardIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

interface Rating {
  id: string;
  rating: number;
  review: string;
  user: {
    name: string;
    image: string;
  };
  productId: string;
  createdAt: Date;
  product: {
    name: string;
    category: string;
    id: string;
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  mrp: number;
  price: number;
  images: string[];
  category: string;
  storeId: string;
  inStock: boolean;
  rating: Rating[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProductDetailsProps {
  product: Product;
  onOpenPropostaModal?: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onOpenPropostaModal }) => {
  const productId = product.id;
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  const cart = useSelector((state: RootState) => state.cart.cartItems);
  const dispatch = useDispatch();

  const router = useRouter();

  const [mainImage, setMainImage] = useState<string>(product.images[0] || '/placeholder-product.png');

  const addToCartHandler = () => {
    dispatch(addToCart({ productId, product }));
  };

  const averageRating =
    product.rating && product.rating.length > 0
      ? product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length
      : 0;

  return (
    <div className="flex max-lg:flex-col gap-12">
      <div className="flex max-sm:flex-col-reverse gap-3">
        <div className="flex sm:flex-col gap-3">
          {product.images.map((image, index) => (
            <div
              key={index}
              onClick={() => setMainImage(product.images[index])}
              className="bg-slate-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer"
            >
              <Image
                src={image}
                className="group-hover:scale-103 group-active:scale-95 transition"
                alt=""
                width={45}
                height={45}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg ">
          <Image src={mainImage} alt="" width={250} height={250} />
        </div>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold text-slate-800">
          {product.name}
        </h1>
        <div className="flex items-center mt-2">
          {Array(5)
            .fill("")
            .map((_, index) => (
              <StarIcon
                key={index}
                size={14}
                className="text-transparent mt-0.5"
                fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"}
              />
            ))}
          <p className="text-sm ml-3 text-slate-500">
            {product.rating?.length || 0} Avaliações
          </p>
        </div>
        <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
          <p>
            {" "}
            {currency}
            {product.price}{" "}
          </p>
          <p className="text-xl text-slate-500 line-through">
            {currency}
            {product.mrp}
          </p>
        </div>
        <div className="flex items-end gap-5 mt-10">
          {cart[productId] && (
            <div className="flex flex-col gap-3">
              <p className="text-lg text-slate-800 font-semibold">Quantidade</p>
              <Counter productId={productId} />
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() =>
                !cart[productId] ? addToCartHandler() : router.push("/cart")
              }
              className="bg-slate-800 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 active:scale-95 transition"
            >
              {!cart[productId] ? "Comprar" : "Ver carrinho"}
            </button>
            {onOpenPropostaModal && (
              <button
                onClick={onOpenPropostaModal}
                className="border-2 border-slate-800 text-slate-800 px-8 py-3 text-sm font-medium rounded hover:bg-slate-50 active:scale-95 transition"
              >
                Fazer Proposta
              </button>
            )}
          </div>
        </div>
        <hr className="border-gray-300 my-5" />
        <div className="flex flex-col gap-4 text-slate-500">
          <p className="flex gap-3">
            {" "}
            <CreditCardIcon className="text-slate-400" /> Pagamento 100% seguro{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

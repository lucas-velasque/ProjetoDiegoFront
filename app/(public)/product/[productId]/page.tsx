"use client";
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import PropostaModal from "@/components/PropostaModal";
import ListaPropostas from "@/components/ListaPropostas";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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

export default function Product() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | undefined>();
  const [isPropostaModalOpen, setIsPropostaModalOpen] = useState<boolean>(false);
  const [refreshPropostas, setRefreshPropostas] = useState<number>(0);
  const products = useSelector((state: RootState) => state.product.list);

  const fetchProduct = async () => {
    const foundProduct = products.find((product: Product) => product.id === productId);
    setProduct(foundProduct);
  };

  useEffect(() => {
    if (products.length > 0) {
      fetchProduct();
    }
    scrollTo(0, 0);
  }, [productId, products]);

  const handlePropostaCreated = () => {
    // Forçar recarregamento da lista de propostas
    setRefreshPropostas((prev) => prev + 1);
  };

  return (
    <div className="mx-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrums */}
        <div className="  text-gray-600 text-sm mt-8 mb-5">
          Home / Produtos / {product?.category}
        </div>

        {/* Product Details */}
        {product && (
          <ProductDetails
            product={product}
            onOpenPropostaModal={() => setIsPropostaModalOpen(true)}
          />
        )}

        {/* Description & Reviews */}
        {product && <ProductDescription product={product} />}

        {/* Lista de Propostas */}
        {product && (
          <ListaPropostas
            productId={product.id}
            tipo="venda"
            key={refreshPropostas}
          />
        )}

        {/* Modal de Proposta */}
        {product && (
          <PropostaModal
            isOpen={isPropostaModalOpen}
            onClose={() => setIsPropostaModalOpen(false)}
            productId={product.id}
            productName={product.name}
            productPrice={product.price}
            onPropostaCreated={handlePropostaCreated}
          />
        )}
      </div>
    </div>
  );
}

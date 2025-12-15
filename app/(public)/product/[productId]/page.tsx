"use client";
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import PropostaModal from "@/components/PropostaModal";
import ListaPropostas from "@/components/ListaPropostas";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAnuncioVendaById } from "@/lib/api/anunciosVenda";
import toast from "react-hot-toast";

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
  const router = useRouter();
  const [product, setProduct] = useState<Product | undefined>();
  const [isPropostaModalOpen, setIsPropostaModalOpen] = useState<boolean>(false);
  const [refreshPropostas, setRefreshPropostas] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const anuncio = await getAnuncioVendaById(Number(productId));

      console.log('Anúncio recebido:', anuncio);

      if (!anuncio) {
        throw new Error('Anúncio não encontrado');
      }

      // Extrair imagens das cartas do anúncio
      // Prioriza foto_url (foto enviada pelo usuário) sobre imagem_url (foto da carta)
      const cartaImages = anuncio.cartas
        ?.map((c: any) => c.foto_url || c.carta?.imagem_url)
        .filter((url: string) => url) || [];

      // Converter AnuncioVenda para Product
      const productData: Product = {
        id: anuncio.id?.toString() || '',
        name: anuncio.titulo || 'Sem título',
        description: anuncio.descricao || '',
        mrp: Number(anuncio.preco_total || 0) * 1.2, // Simulando preço original
        price: Number(anuncio.preco_total || 0),
        images: cartaImages.length > 0
          ? cartaImages
          : ['https://via.placeholder.com/400x400?text=Sem+Imagem'], // Placeholder online
        category: 'Cartas',
        storeId: anuncio.usuario_id?.toString() || '',
        inStock: (anuncio.quantidade_disponivel || 0) > 0,
        rating: [], // Por enquanto vazio
        createdAt: anuncio.created_at || new Date(),
        updatedAt: anuncio.updated_at || new Date(),
      };

      console.log('Product data:', productData);
      setProduct(productData);
    } catch (err) {
      console.error('Erro ao buscar produto:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar produto';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
    scrollTo(0, 0);
  }, [productId]);

  const handlePropostaCreated = () => {
    // Forçar recarregamento da lista de propostas
    setRefreshPropostas((prev) => prev + 1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-gray-600 text-sm mt-8 mb-5">Home / Produtos / Carregando...</div>
          <div className="animate-pulse">
            <div className="flex max-lg:flex-col gap-12">
              <div className="flex gap-3">
                <div className="flex flex-col gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-slate-100 size-26 rounded-lg"></div>
                  ))}
                </div>
                <div className="bg-slate-100 size-113 rounded-lg"></div>
              </div>
              <div className="flex-1">
                <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mx-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-gray-600 text-sm mt-8 mb-5">Home / Produtos / Erro</div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-semibold mb-2">Erro ao carregar produto</h2>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={fetchProduct}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Tentar novamente
              </button>
              <button
                onClick={() => router.push('/shop')}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
              >
                Voltar para a loja
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No product found
  if (!product) {
    return (
      <div className="mx-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-gray-600 text-sm mt-8 mb-5">Home / Produtos / Não encontrado</div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
            <p className="text-slate-600 text-lg mb-4">Produto não encontrado</p>
            <button
              onClick={() => router.push('/shop')}
              className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition"
            >
              Voltar para a loja
            </button>
          </div>
        </div>
      </div>
    );
  }

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

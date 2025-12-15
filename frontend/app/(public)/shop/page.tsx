'use client'
import { Suspense, useEffect, useState } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { getAnunciosVenda, type AnuncioVenda } from "@/lib/api/anunciosVenda"
import toast from "react-hot-toast"

function ShopContent() {
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()

    const [anuncios, setAnuncios] = useState<AnuncioVenda[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchAnuncios()
    }, [search])

    const fetchAnuncios = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const filtros: any = {
                status: 'ativo', // Apenas anúncios ativos
            }

            // Se houver busca, adicionar ao filtro
            if (search) {
                filtros.nome_carta = search
            }

            const response = await getAnunciosVenda(filtros)

            // Verificar se é resposta paginada ou array simples
            const data = Array.isArray(response) ? response : response.data
            setAnuncios(data)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar anúncios'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-[70vh] mx-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl text-slate-500 my-6">
                        Carregando <span className="text-slate-700 font-medium">Produtos</span>
                    </h1>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 xl:gap-12 mx-auto mb-32">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-slate-100 rounded-lg animate-pulse">
                                <div className="aspect-square bg-slate-200 rounded-t-lg"></div>
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-[70vh] mx-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
                        <h2 className="text-red-800 font-semibold mb-2">Erro ao carregar produtos</h2>
                        <p className="text-red-600 text-sm">{error}</p>
                        <button
                            onClick={fetchAnuncios}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            Tentar novamente
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Empty state
    if (anuncios.length === 0) {
        return (
            <div className="min-h-[70vh] mx-6">
                <div className="max-w-7xl mx-auto">
                    <h1
                        onClick={() => router.push('/shop')}
                        className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"
                    >
                        {search && <MoveLeftIcon size={20} />}
                        Todos os <span className="text-slate-700 font-medium">Produtos</span>
                    </h1>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
                        <p className="text-slate-600 text-lg">
                            {search
                                ? `Nenhum produto encontrado para "${search}"`
                                : 'Nenhum produto disponível no momento'
                            }
                        </p>
                        {search && (
                            <button
                                onClick={() => router.push('/shop')}
                                className="mt-4 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition"
                            >
                                Ver todos os produtos
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[70vh] mx-6">
            <div className=" max-w-7xl mx-auto">
                <h1
                    onClick={() => router.push('/shop')}
                    className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"
                >
                    {search && <MoveLeftIcon size={20} />}
                    Todos os <span className="text-slate-700 font-medium">Produtos</span>
                </h1>
                <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
                    {anuncios.map((anuncio) => (
                        <ProductCard
                            key={anuncio.id}
                            product={{
                                id: anuncio.id.toString(),
                                name: anuncio.titulo,
                                price: Number(anuncio.preco_total),
                                // Usar imagens placeholder por enquanto (até integrar upload)
                                images: ['/placeholder-product.png'],
                                // Dados adicionais necessários pelo ProductCard
                                mrp: Number(anuncio.preco_total) * 1.2, // Preço com "desconto"
                                category: 'Cartas',
                                description: anuncio.descricao || '',
                                storeId: anuncio.usuario_id.toString(),
                                inStock: anuncio.quantidade_disponivel > 0,
                                rating: [],
                                createdAt: anuncio.created_at,
                                updatedAt: anuncio.updated_at,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><div className="text-slate-600">Carregando loja...</div></div>}>
      <ShopContent />
    </Suspense>
  );
}

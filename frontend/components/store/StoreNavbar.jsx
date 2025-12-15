'use client'
import Link from "next/link"
import { useUser } from "@clerk/nextjs"

const StoreNavbar = () => {
    const { user } = useUser();

    return (
        <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all bg-white">
            <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                <span className="text-[#00004F]">Póke</span>Trade
                <p className="absolute text-xs font-semibold -top-1 -right-16 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-[#00004F]">
                    Loja
                </p>
            </Link>
            <div className="flex items-center gap-3">
                <p className="text-slate-700">
                    Olá, {user?.firstName || user?.username || 'Vendedor'}
                </p>
            </div>
        </div>
    )
}

export default StoreNavbar
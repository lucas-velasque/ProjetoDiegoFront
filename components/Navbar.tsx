"use client";

import { PackageIcon, Search, ShoppingCart, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { RootState } from "@/lib/store";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const router = useRouter();

  const [search, setSearch] = useState("");
  const cartCount = useSelector((state: RootState) => state.cart.total);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
  };

  return (
    <nav className="relative bg-white">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
          {/* Logo */}
          <Link
            href="/"
            className="relative text-4xl font-semibold text-slate-700"
          >
            <span className="text-[#00004F]">PókeTrade</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
            <Link href="/">Home</Link>
            <Link href="/shop">Produtos</Link>
            <Link href="/">Sobre</Link>
            <Link href="/">Fale conosco</Link>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full"
            >
              <Search size={18} className="text-slate-600" />
              <input
                className="w-full bg-transparent outline-none placeholder-slate-600"
                type="text"
                placeholder="Buscar"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </form>

            {/* Carrinho */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-slate-600"
            >
              <ShoppingCart size={18} />
              Carrinho
              <span className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            {/* Login / User Menu */}
            {!user ? (
              <button
                onClick={() => openSignIn()}
                className="px-8 py-2 bg-[#00004F] hover:bg-[#3C5AA6] transition text-white rounded-full"
              >
                Login
              </button>
            ) : (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    labelIcon={<PlusCircle size={16} />}
                    label="Criar Anúncio"
                    onClick={() => router.push("/store/add-product")}
                  />
                  <UserButton.Action
                    labelIcon={<PackageIcon size={16} />}
                    label="Meus Anúncios"
                    onClick={() => router.push("/store/manage-product")}
                  />
                  <UserButton.Action
                    labelIcon={<PackageIcon size={16} />}
                    label="Meus Pedidos"
                    onClick={() => router.push("/orders")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            )}
          </div>

          {/* Mobile */}
          <div className="sm:hidden">
            {!user ? (
              <button
                onClick={() => openSignIn()}
                className="px-7 py-1.5 bg-[#00004F] hover:bg-[#3C5AA6] text-sm transition text-white rounded-full"
              >
                Login
              </button>
            ) : (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    labelIcon={<PlusCircle size={16} />}
                    label="Criar Anúncio"
                    onClick={() => router.push("/store/add-product")}
                  />
                  <UserButton.Action
                    labelIcon={<PackageIcon size={16} />}
                    label="Meus Anúncios"
                    onClick={() => router.push("/store/manage-product")}
                  />
                  <UserButton.Action
                    labelIcon={<ShoppingCart size={16} />}
                    label="Carrinho"
                    onClick={() => router.push("/cart")}
                  />
                  <UserButton.Action
                    labelIcon={<PackageIcon size={16} />}
                    label="Meus Pedidos"
                    onClick={() => router.push("/orders")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            )}
          </div>
        </div>
      </div>

      <hr className="border-gray-300" />
    </nav>
  );
};

export default Navbar;

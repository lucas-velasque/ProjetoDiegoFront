"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Package, Tag, Gavel, User2, ChevronLeft, ChevronRight } from "lucide-react";

const AdminSidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarLinks = [
    {
      name: "Categoria carta",
      href: "/admin/Categoria_carta",
      icon: Package,
    },
    {
      name: "Categoria leilão",
      href: "/admin/Categoria_leilao",
      icon: Tag,
    },
    {
      name: "Leilões",
      href: "/admin/leiloes",
      icon: Gavel,
    },
    {
      name: "Níveis usuário",
      href: "/admin/Niveis_usuario",
      icon: User2,
    },
  ];

  return (
    <div
      className={[
        "inline-flex h-full flex-col border-r border-slate-200 transition-all duration-200",
        collapsed ? "w-20" : "sm:min-w-60 w-60",
      ].join(" ")}
    >
      {/* Header / Toggle */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-slate-100">
        {/* Title */}
        {!collapsed ? (
          <span className="text-sm font-semibold text-slate-600 select-none">
            Menu
          </span>
        ) : (
          <span className="sr-only">Menu</span>
        )}

        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-slate-50 text-slate-500"
          aria-label={collapsed ? "Abrir menu" : "Fechar menu"}
          title={collapsed ? "Abrir menu" : "Fechar menu"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="max-sm:mt-4">
        {sidebarLinks.map((link, index) => {
          const active = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={index}
              href={link.href}
              title={collapsed ? link.name : undefined}
              className={[
                "relative flex items-center text-slate-500 hover:bg-slate-50 transition",
                collapsed ? "justify-center px-2 py-3" : "gap-3 p-2.5",
                active ? "bg-slate-100 sm:text-slate-600" : "",
              ].join(" ")}
            >
              <Icon size={18} className={collapsed ? "" : "sm:ml-5"} />
              {!collapsed && <p className="max-sm:hidden">{link.name}</p>}

              {active && (
                <span className="absolute bg-green-500 right-0 top-1.5 bottom-1.5 w-1 sm:w-1.5 rounded-l" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSidebar;

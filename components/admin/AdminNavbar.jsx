<<<<<<< HEAD
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const AdminNavbar = () => {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("admin_user");
    if (user) {
      try {
        setAdminUser(JSON.parse(user));
      } catch (error) {
        console.error("Erro ao parsear admin user:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  return (
    <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
      <Link href="/" className="relative text-4xl font-semibold text-slate-700">
        <span className="text-[#00004F]">PókeTrade</span>
        <p className="absolute text-xs font-semibold -top-1 -right-13 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-blue-500">
          Admin
        </p>
      </Link>

      <div className="flex items-center gap-4">
        {adminUser && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{adminUser.nome}</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {adminUser.nome?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="px-7 py-1.5 bg-red-500 hover:bg-red-600 text-sm transition text-white rounded-full"
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
=======
"use client";
import Link from "next/link";

const AdminNavbar = () => {
  return (
    <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
      <Link href="/" className="relative text-4xl font-semibold text-slate-700">
        <span className="text-[#00004F]">PókeTrade</span>
        <p className="absolute text-xs font-semibold -top-1 -right-13 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-blue-500">
          Admin
        </p>
      </Link>

      <Link href="/">
        <button className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full">
          Voltar para home
        </button>
      </Link>
    </div>
  );
};

export default AdminNavbar;
>>>>>>> origin/main

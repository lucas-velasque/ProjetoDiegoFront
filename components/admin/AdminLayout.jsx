
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../Loading";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchIsAdmin = async () => {
    try {
      // Verificar se há token de admin no localStorage
      const adminToken = localStorage.getItem("admin_token");
      const adminUser = localStorage.getItem("admin_user");

      if (adminToken && adminUser) {
        try {
          const user = JSON.parse(adminUser);
          // Verificar se o usuário é admin (nivel_usuario_id = 1)
          if (user.nivel_usuario_id === 1) {
            setIsAdmin(true);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("Erro ao parsear admin user:", error);
        }
      }

      // Se não tem token ou não é admin, redirecionar para login
      setIsAdmin(false);
      setLoading(false);
      router.push("/admin/login");
    } catch (error) {
      console.error("Erro ao verificar admin:", error);
      setIsAdmin(false);
      setLoading(false);
      router.push("/admin/login");
    }
  };

  useEffect(() => {
    fetchIsAdmin();
  }, []);

  return loading ? (
    <Loading />
  ) : isAdmin ? (
    <div className="flex flex-col h-screen">
      <AdminNavbar />
      <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
        <AdminSidebar />
        <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
          {children}
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">
        Você não tem autorização para acessar essa página
      </h1>
      <Link
        href="/admin/login"
        className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full"
      >
        Ir para login <ArrowRightIcon size={18} />
      </Link>
    </div>
  );
};

export default AdminLayout;

"use client";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchIsAdmin = async () => {
    setIsAdmin(true);
    setLoading(false);
  };

  useEffect(() => {
    fetchIsAdmin();
  }, []);

  return loading ? (
    <Loading />
  ) : isAdmin ? (
    <div className="flex flex-col h-screen">
      <AdminNavbar />
      <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
        <AdminSidebar />
        <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
          {children}
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">
        Você não tem autorização para acessar essa página
      </h1>
      <Link
        href="/"
        className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full"
      >
        Ir para home <ArrowRightIcon size={18} />
      </Link>
    </div>
  );
};

export default AdminLayout;


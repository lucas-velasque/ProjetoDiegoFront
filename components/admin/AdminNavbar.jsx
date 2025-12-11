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

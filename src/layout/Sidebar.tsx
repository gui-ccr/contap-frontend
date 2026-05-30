import Link from "next/link";

export function Sidebar() {
  return (
    <nav className="hidden md:flex bg-[#131313] border-r border-white/10 w-64 h-screen fixed left-0 top-0 flex-col p-4">
      <div className="text-white font-bold text-xl mb-8 px-4">ContaUp</div>
      
      <div className="flex-1 flex flex-col gap-2">
        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded bg-white/5 text-white font-medium">
          <span className="material-symbols-outlined">dashboard</span>
          Dashboard
        </Link>
        <Link href="/lancamentos" className="flex items-center gap-3 px-4 py-3 rounded text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined">receipt_long</span>
          Lançamentos
        </Link>
      </div>

      <div className="border-t border-white/10 pt-4">
        <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded">
          <span className="material-symbols-outlined">logout</span>
          Sair
        </Link>
      </div>
    </nav>
  );
}
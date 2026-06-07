import { Bell, RefreshCw, Plus } from "lucide-react";

interface DashboardHeaderProps {
  today: string;
}

export function DashboardHeader({ today }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <p className="text-xs text-gray-500 font-medium capitalize">{today}</p>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">Visão Geral</h1>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium text-gray-300 hover:text-white transition-all cursor-pointer"
          style={{ background: "#1e1e1e" }}
        >
          <RefreshCw size={14} />
          <span className="hidden sm:inline">Conferir dados</span>
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold text-white hover:opacity-90 transition-all shadow-lg cursor-pointer"
          style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Novo lançamento</span>
        </button>
      </div>
    </header>
  );
}

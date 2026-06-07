import { Search, LayoutGrid, List } from "lucide-react";

interface FuncionariosToolbarProps {
  search: string;
  viewMode: "grid" | "list";
  onSearch: (v: string) => void;
  onViewMode: (v: "grid" | "list") => void;
}

export function FuncionariosToolbar({ search, viewMode, onSearch, onViewMode }: FuncionariosToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b7280" }} />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar por nome, e-mail ou cargo..."
          className="w-full rounded-2xl pl-9 pr-4 py-2.5 text-sm outline-none transition-all"
          style={{ background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.06)", color: "#e5e2e1" }}
        />
      </div>

      <div className="flex items-center rounded-2xl p-1 shrink-0" style={{ background: "#1e1e1e" }}>
        <button
          onClick={() => onViewMode("grid")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          style={viewMode === "grid" ? { background: "#4edea318", color: "#4edea3" } : { color: "#6b7280" }}
        >
          <LayoutGrid size={14} />
          <span className="hidden sm:inline">Cards</span>
        </button>
        <button
          onClick={() => onViewMode("list")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          style={viewMode === "list" ? { background: "#4edea318", color: "#4edea3" } : { color: "#6b7280" }}
        >
          <List size={14} />
          <span className="hidden sm:inline">Lista</span>
        </button>
      </div>
    </div>
  );
}

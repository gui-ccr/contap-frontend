import { Search, LayoutGrid, List } from "lucide-react";
import { Input, Button } from "@/ui/forms";

interface FuncionariosToolbarProps {
  search: string;
  viewMode: "grid" | "list";
  onSearch: (v: string) => void;
  onViewMode: (v: "grid" | "list") => void;
}

export function FuncionariosToolbar({
  search,
  viewMode,
  onSearch,
  onViewMode,
}: FuncionariosToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="relative flex-1">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60"
        />
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar por nome, e-mail ou cargo..."
          className="!pl-9"
        />
      </div>

      <div className="flex justify-end sm:justify-start">
        <div className="flex items-center rounded-xl p-1 shrink-0 bg-surface-container-low border border-outline-variant/20">
          <button
            onClick={() => onViewMode("grid")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "grid" ? "bg-primary/10 text-primary" : "text-on-surface-variant/60 hover:text-on-surface"
            }`}
          >
            <LayoutGrid size={14} />
            <span className="hidden sm:inline">Cards</span>
          </button>
          <button
            onClick={() => onViewMode("list")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "list" ? "bg-primary/10 text-primary" : "text-on-surface-variant/60 hover:text-on-surface"
            }`}
          >
            <List size={14} />
            <span className="hidden sm:inline">Lista</span>
          </button>
        </div>
      </div>
    </div>
  );
}

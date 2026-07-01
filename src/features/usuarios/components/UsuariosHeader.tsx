import { Plus } from "lucide-react";

interface UsuariosHeaderProps {
  ativos: number;
  total: number;
  onNovo: () => void;
}

export function UsuariosHeader({ ativos, total, onNovo }: UsuariosHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: "#e5e2e1" }}>
          Gestão de Funcionários
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
          {ativos} ativo{ativos !== 1 ? "s" : ""} · {total} no total
        </p>
      </div>
      <button
        onClick={onNovo}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 shadow-lg self-start sm:self-auto cursor-pointer"
        style={{ background: "#4edea3", color: "#003824" }}
      >
        <Plus size={15} strokeWidth={2.5} />
        Novo Funcionário
      </button>
    </div>
  );
}

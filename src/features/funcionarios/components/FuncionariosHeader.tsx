import { Plus } from "lucide-react";

interface FuncionariosHeaderProps {
  ativos: number;
  total: number;
  onNovo: () => void;
  onCargos: () => void;
}

export function FuncionariosHeader({ ativos, total, onNovo, onCargos }: FuncionariosHeaderProps) {
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
      <div className="flex gap-2 self-start sm:self-auto">
        <button
          onClick={onCargos}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all hover:bg-white/5 cursor-pointer"
          style={{ color: "#e5e2e1", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          Cargos
        </button>
        <button
          onClick={onNovo}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 shadow-lg cursor-pointer"
          style={{ background: "#4edea3", color: "#003824" }}
        >
          <Plus size={15} strokeWidth={2.5} />
          Novo Funcionário
        </button>
      </div>
    </div>
  );
}

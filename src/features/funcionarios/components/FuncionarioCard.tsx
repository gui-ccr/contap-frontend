import { Pencil, Trash2 } from "lucide-react";
import type { Funcionario } from "../types/types";

function formatDate(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function calcIdade(iso: string) {
  if (!iso) return "";
  const hoje = new Date();
  const nasc = new Date(iso);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return `${idade} anos`;
}

interface FuncionarioCardProps {
  f: Funcionario;
  onRemove?: (id: string) => void;
}

function cargoLabel(cargo: string) {
  const labels: Record<string, string> = {
    GERENTE: "Gerente",
    CAIXA: "Caixa",
    DONO: "Dono",
  };
  return labels[cargo] ?? cargo;
}

export function FuncionarioCard({ f, onRemove }: FuncionarioCardProps) {
  return (
    <div
      className="rounded-3xl p-5 flex flex-col gap-4 group transition-all duration-200 hover:scale-[1.01]"
      style={{ background: "#1e1e1e" }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold overflow-hidden"
          style={{ background: f.foto ? "transparent" : `${f.cor}20`, color: f.cor }}
        >
          {f.foto
            ? <img src={f.foto} alt={f.nome} className="w-full h-full object-cover" />
            : f.iniciais}
        </div>
        <span
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={f.ativo
            ? { background: "#4edea318", color: "#4edea3" }
            : { background: "rgba(255,255,255,0.05)", color: "#6b7280" }}
        >
          {f.ativo ? "Ativo" : "Inativo"}
        </span>
      </div>

      <div className="flex-1">
        <p className="text-sm font-semibold" style={{ color: "#e5e2e1" }}>{f.nome}</p>
        <p className="text-xs mt-0.5 font-medium" style={{ color: f.cor }}>{cargoLabel(f.cargo)}</p>
        <p className="text-xs mt-2 truncate" style={{ color: "#6b7280" }}>{f.email}</p>
      </div>

      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div>
          <p className="text-[10px]" style={{ color: "#6b7280" }}>Nascimento</p>
          <p className="text-xs font-medium mt-0.5" style={{ color: "#e5e2e1" }}>
            {formatDate(f.dataNascimento)}
            <span className="ml-1" style={{ color: "#6b7280" }}>· {calcIdade(f.dataNascimento)}</span>
          </p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            className="w-7 h-7 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ color: "#6b7280" }} title="Editar"
          >
            <Pencil size={13} />
          </button>
          <button
            type="button"
            onClick={() => onRemove?.(f.id)}
            className="w-7 h-7 rounded-xl flex items-center justify-center transition-colors hover:bg-red-500/10"
            style={{ color: "#6b7280" }} title="Remover"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

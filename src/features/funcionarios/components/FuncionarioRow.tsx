import { Pencil, Trash2 } from "lucide-react";
import type { Funcionario } from "../types/types";
import { formatCpfCnpj } from "@/utils/format";



interface FuncionarioRowProps {
  f: Funcionario;
  onRemove?: (id: string) => void;
  onEdit?: (f: Funcionario) => void;
}

function cargoLabel(cargo: string) {
  const labels: Record<string, string> = {
    GERENTE: "Gerente",
    CAIXA: "Caixa",
    DONO: "Dono",
  };
  return labels[cargo] ?? cargo;
}

export function FuncionarioRow({ f, onRemove, onEdit }: FuncionarioRowProps) {
  return (
    <tr
      className="transition-colors border-b"
      style={{ borderColor: "rgba(255,255,255,0.04)" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden"
            style={{ background: `${f.cor}20`, color: f.cor }}
          >
            {f.iniciais}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#e5e2e1" }}>{f.nome}</p>
            <p className="text-xs" style={{ color: "#6b7280" }}>{f.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-medium px-2.5 py-1 rounded-xl" style={{ background: `${f.cor}15`, color: f.cor }}>
          {cargoLabel(f.cargo)}
        </span>
      </td>
      <td className="hidden md:table-cell px-4 py-3 text-xs font-mono" style={{ color: "#6b7280" }}>
        {f.cpf_cnpj ? formatCpfCnpj(f.cpf_cnpj) : "—"}
      </td>
      <td className="hidden md:table-cell px-4 py-3 text-xs font-medium" style={{ color: "#6b7280" }}>
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(f.salario)}
      </td>
      <td className="hidden md:table-cell px-4 py-3 text-xs font-medium" style={{ color: "#6b7280" }}>
        {f.data_admissao ? new Date(f.data_admissao + "T00:00:00").toLocaleDateString('pt-BR') : "—"}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1 justify-end">
          <button
            type="button"
            onClick={() => onEdit?.(f)}
            className="w-7 h-7 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ color: "#6b7280" }}
          >
            <Pencil size={13} />
          </button>
          <button
            type="button"
            onClick={() => onRemove?.(f.id)}
            className="w-7 h-7 rounded-xl flex items-center justify-center transition-colors hover:bg-red-500/10"
            style={{ color: "#6b7280" }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}

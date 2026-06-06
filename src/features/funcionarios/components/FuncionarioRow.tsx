import { Pencil, Trash2 } from "lucide-react";
import type { Funcionario } from "../types/types";

function formatDate(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

interface FuncionarioRowProps {
  f: Funcionario;
}

export function FuncionarioRow({ f }: FuncionarioRowProps) {
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
            style={{ background: f.foto ? "transparent" : `${f.cor}20`, color: f.cor }}
          >
            {f.foto ? <img src={f.foto} alt={f.nome} className="w-full h-full object-cover" /> : f.iniciais}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#e5e2e1" }}>{f.nome}</p>
            <p className="text-xs" style={{ color: "#6b7280" }}>{f.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-medium px-2.5 py-1 rounded-xl" style={{ background: `${f.cor}15`, color: f.cor }}>
          {f.cargo}
        </span>
      </td>
      <td className="hidden md:table-cell px-4 py-3 text-xs font-mono" style={{ color: "#6b7280" }}>
        {f.cpf}
      </td>
      <td className="hidden md:table-cell px-4 py-3 text-xs" style={{ color: "#6b7280" }}>
        {formatDate(f.dataNascimento)}
      </td>
      <td className="px-4 py-3">
        <span
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={f.ativo
            ? { background: "#4edea318", color: "#4edea3" }
            : { background: "rgba(255,255,255,0.05)", color: "#6b7280" }}
        >
          {f.ativo ? "Ativo" : "Inativo"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1 justify-end">
          <button
            className="w-7 h-7 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ color: "#6b7280" }}
          >
            <Pencil size={13} />
          </button>
          <button
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

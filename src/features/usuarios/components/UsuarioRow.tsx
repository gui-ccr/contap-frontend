import { Pencil, Trash2 } from "lucide-react";
import type { Usuario } from "../types/types";



interface UsuarioRowProps {
  f: Usuario;
  onRemove?: (id: string) => void;
  onEdit?: (f: Usuario) => void;
}

function cargoLabel(cargo: string) {
  const labels: Record<string, string> = {
    GERENTE: "Gerente",
    CAIXA: "Caixa",
    DONO: "Dono",
  };
  return labels[cargo] ?? cargo;
}

export function UsuarioRow({ f, onRemove, onEdit }: UsuarioRowProps) {
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
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden bg-cover bg-center"
            style={f.foto_url ? { 
              backgroundImage: `url(${f.foto_url})`, 
              border: `1px solid ${f.cor}30` 
            } : { 
              background: `${f.cor}20`, 
              color: f.cor,
              border: `1px solid ${f.cor}30` 
            }}
          >
            {!f.foto_url && f.iniciais}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#e5e2e1" }}>{f.nome}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-medium px-2.5 py-1 rounded-xl" style={{ background: `${f.cor}15`, color: f.cor }}>
          {cargoLabel(f.cargo)}
        </span>
      </td>
      <td className="hidden md:table-cell px-4 py-3 text-xs" style={{ color: "#6b7280" }}>
        {f.email}
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

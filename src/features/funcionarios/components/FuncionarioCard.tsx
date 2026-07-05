import { Pencil, Trash2, Mail, CreditCard, Calendar, User, CircleDot } from "lucide-react";
import type { Funcionario } from "../types/types";
import { formatCpfCnpj } from "@/utils/format";

interface FuncionarioCardProps {
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

export function FuncionarioCard({ f, onRemove, onEdit }: FuncionarioCardProps) {
  return (
    <div
      className="rounded-3xl p-5 flex flex-col gap-5 group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden"
      style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.04)" }}
    >
      {/* Background Gradient Effect */}
      <div 
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-30 pointer-events-none" 
        style={{ background: f.cor }} 
      />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shadow-inner flex-shrink-0 bg-cover bg-center"
            style={f.foto_url ? { 
              backgroundImage: `url(${f.foto_url})`, 
              border: `1px solid ${f.cor}30` 
            } : { 
              background: `${f.cor}15`, 
              color: f.cor, 
              border: `1px solid ${f.cor}30` 
            }}
          >
            {!f.foto_url && f.iniciais}
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold text-white tracking-tight truncate">{f.nome}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-0.5 truncate" style={{ color: f.cor }}>{cargoLabel(f.cargo)}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0 ml-2">
          <span
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={f.ativo
              ? { background: "rgba(78,222,163,0.1)", color: "#4edea3", border: "1px solid rgba(78,222,163,0.2)" }
              : { background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <CircleDot size={8} fill="currentColor" />
            {f.ativo ? "Ativo" : "Inativo"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-4 gap-x-2 relative z-10 pt-2 pb-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-1.5"><Mail size={11}/> Email</p>
          <p className="text-xs font-medium text-gray-300 truncate" title={f.email}>{f.email || "—"}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-1.5"><CreditCard size={11}/> Documento</p>
          <p className="text-xs font-medium text-gray-300 truncate">{f.cpf_cnpj ? formatCpfCnpj(f.cpf_cnpj) : "—"}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-1.5"><User size={11}/> Salário</p>
          <p className="text-sm font-bold text-white">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(f.salario)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-1.5"><Calendar size={11}/> Admissão</p>
          <p className="text-sm font-bold text-gray-200">
            {f.data_admissao ? new Date(f.data_admissao + "T00:00:00").toLocaleDateString('pt-BR') : "—"}
          </p>
        </div>
      </div>

      <div
        className="flex items-center justify-end pt-4 relative z-10 mt-auto"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(f)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:bg-white/10"
            style={{ color: "#9ca3af" }} title="Editar"
          >
            <Pencil size={13} /> Editar
          </button>
          <button
            type="button"
            onClick={() => onRemove?.(f.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:bg-red-500/10 hover:text-red-400"
            style={{ color: "#9ca3af" }} title="Remover"
          >
            <Trash2 size={13} /> Remover
          </button>
        </div>
      </div>
    </div>
  );
}

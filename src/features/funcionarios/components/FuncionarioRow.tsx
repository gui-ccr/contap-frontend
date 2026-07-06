import { Pencil, Trash2 } from "lucide-react";
import type { Funcionario } from "../types/types";
import { formatCpfCnpj } from "@/utils/format";
import { Button } from "@/ui/forms";



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
    <tr className="transition-colors border-b border-outline-variant/10 hover:bg-on-surface/[0.02]">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden"
            style={{ background: `${f.cor}20`, color: f.cor }}
          >
            {f.iniciais}
          </div>
          <div>
            <p className="text-body-sm font-semibold text-on-surface">{f.nome}</p>
            <p className="text-label-sm text-on-surface-variant/70">{f.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-medium px-2.5 py-1 rounded-xl" style={{ background: `${f.cor}15`, color: f.cor }}>
          {cargoLabel(f.cargo)}
        </span>
      </td>
      <td className="hidden md:table-cell px-4 py-3 text-xs font-mono text-on-surface-variant/70">
        {f.cpf_cnpj ? formatCpfCnpj(f.cpf_cnpj) : "—"}
      </td>
      <td className="hidden md:table-cell px-4 py-3 text-xs font-medium text-on-surface-variant/70">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(f.salario)}
      </td>
      <td className="hidden md:table-cell px-4 py-3 text-xs font-medium text-on-surface-variant/70">
        {f.data_admissao ? new Date(f.data_admissao + "T00:00:00").toLocaleDateString('pt-BR') : "—"}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1 justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onEdit?.(f)}
            className="!w-7 !h-7 !p-0 !rounded-xl"
          >
            <Pencil size={13} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onRemove?.(f.id)}
            className="!w-7 !h-7 !p-0 !rounded-xl hover:!text-error hover:!bg-error/10"
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </td>
    </tr>
  );
}

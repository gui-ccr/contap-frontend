import { Plus } from "lucide-react";
import { Button } from "@/ui/forms";

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
        <h1 className="text-headline-md font-bold tracking-tight text-on-surface">
          Recursos Humanos (RH)
        </h1>
        <p className="text-body-sm mt-1 text-on-surface-variant/70">
          {ativos} ativo{ativos !== 1 ? "s" : ""} · {total} no total
        </p>
      </div>
      <div className="flex gap-2 self-start sm:self-auto">
        <Button variant="tonal" onClick={onCargos} className="shadow-sm">
          Cargos
        </Button>
        <Button variant="primary" onClick={onNovo} className="shadow-lg">
          <Plus size={15} strokeWidth={2.5} />
          Novo Funcionário
        </Button>
      </div>
    </div>
  );
}

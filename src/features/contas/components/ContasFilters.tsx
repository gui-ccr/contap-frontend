import { X } from "lucide-react";
import { Field, Input, Select, Button } from "@/ui/forms";
import type { ContaContabil } from "@/features/plano-contas/planoContasService";

export type FiltroStatus = "todos" | "pendente" | "liquidado";

interface ContasFiltersProps {
  filter: FiltroStatus;
  onFilter: (f: FiltroStatus) => void;
  dataInicio: string;
  onDataInicio: (v: string) => void;
  dataFim: string;
  onDataFim: (v: string) => void;
  tipoFiltro: string;
  onTipoFiltro: (v: string) => void;
  planoContas: ContaContabil[];
  statusLiquidado: string;
}

export function ContasFilters({
  filter, onFilter,
  dataInicio, onDataInicio,
  dataFim, onDataFim,
  tipoFiltro, onTipoFiltro,
  planoContas, statusLiquidado,
}: ContasFiltersProps) {
  const abas: { key: FiltroStatus; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "pendente", label: "Pendentes" },
    { key: "liquidado", label: `${statusLiquidado}s` },
  ];

  return (
    <div className="bg-surface-container p-4 rounded-2xl flex flex-col sm:flex-row flex-wrap gap-4 items-end border border-outline-variant/30">
      <div className="flex gap-1 p-1 rounded-xl bg-surface-container-low">
        {abas.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onFilter(key)}
            className={`cursor-pointer px-4 py-2 rounded-lg text-label-sm font-semibold transition-all ${
              filter === key
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant/60 hover:text-on-surface"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-wrap gap-4">
        <Field label="Data inicial" className="flex-1 min-w-[120px]">
          <Input type="date" value={dataInicio} onChange={(e) => onDataInicio(e.target.value)} />
        </Field>
        <Field label="Data final" className="flex-1 min-w-[120px]">
          <Input type="date" value={dataFim} onChange={(e) => onDataFim(e.target.value)} />
        </Field>
        <Field label="Tipo de conta" className="flex-1 min-w-[140px]">
          <Select value={tipoFiltro} onChange={(e) => onTipoFiltro(e.target.value)}>
            <option value="">Todas</option>
            {planoContas.map((pc) => (
              <option key={pc.id} value={pc.id}>{pc.codigo} - {pc.nome}</option>
            ))}
          </Select>
        </Field>
      </div>

      {(dataInicio || dataFim || tipoFiltro) && (
        <Button
          variant="ghost"
          onClick={() => { onDataInicio(""); onDataFim(""); onTipoFiltro(""); }}
        >
          <X size={14} /> Limpar
        </Button>
      )}
    </div>
  );
}

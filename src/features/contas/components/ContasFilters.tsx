import { X } from "lucide-react";
import { Field, Input, Select, Button } from "@/ui/forms";
import type { ContaContabil } from "@/features/plano-contas/planoContasService";
import { DatePicker } from "@/ui/aria/application/date-picker/date-picker";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "react-aria-components";

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
  valorMinimo: string;
  onValorMinimo: (v: string) => void;
  valorMaximo: string;
  onValorMaximo: (v: string) => void;
  planoContas: ContaContabil[];
  statusLiquidado: string;
}

export function ContasFilters({
  filter, onFilter,
  dataInicio, onDataInicio,
  dataFim, onDataFim,
  tipoFiltro, onTipoFiltro,
  valorMinimo, onValorMinimo,
  valorMaximo, onValorMaximo,
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
          <Button
            key={key}
            variant={filter === key ? "primary" : "ghost"}
            onClick={() => onFilter(key)}
            className="!px-4 !py-2 !rounded-lg"
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="flex-1 flex flex-wrap gap-4">
        <Field label="Data inicial" className="flex-1 min-w-[120px]">
          <DatePicker
            value={dataInicio ? parseDate(dataInicio) : null}
            onChange={(v: DateValue | null) => onDataInicio(v ? v.toString() : "")}
          />
        </Field>
        <Field label="Data final" className="flex-1 min-w-[120px]">
          <DatePicker
            value={dataFim ? parseDate(dataFim) : null}
            onChange={(v: DateValue | null) => onDataFim(v ? v.toString() : "")}
          />
        </Field>
        <Field label="Tipo de conta" className="flex-1 min-w-[140px]">
          <Select value={tipoFiltro} onChange={(e) => onTipoFiltro(e.target.value)}>
            <option value="">Todas</option>
            {planoContas.map((pc) => (
              <option key={pc.id} value={pc.id}>{pc.codigo} - {pc.nome}</option>
            ))}
          </Select>
        </Field>
        <Field label="Valor Min." className="flex-1 min-w-[90px]">
          <Input
            type="number"
            step="0.01"
            placeholder="0,00"
            value={valorMinimo}
            onChange={(e) => onValorMinimo(e.target.value)}
          />
        </Field>
        <Field label="Valor Max." className="flex-1 min-w-[90px]">
          <Input
            type="number"
            step="0.01"
            placeholder="0,00"
            value={valorMaximo}
            onChange={(e) => onValorMaximo(e.target.value)}
          />
        </Field>
      </div>

      {(dataInicio || dataFim || tipoFiltro || valorMinimo || valorMaximo) && (
        <Button
          variant="ghost"
          onClick={() => { onDataInicio(""); onDataFim(""); onTipoFiltro(""); onValorMinimo(""); onValorMaximo(""); }}
        >
          <X size={14} /> Limpar
        </Button>
      )}
    </div>
  );
}

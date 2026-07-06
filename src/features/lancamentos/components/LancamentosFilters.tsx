import { Filter, X } from "lucide-react";
import { Field, Select, Button } from "@/ui/forms";
import { DatePicker } from "@/src/ui/application/date-picker/date-picker";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "react-aria-components";

interface Conta {
  value: string;
  label: string;
}

interface LancamentosFiltersProps {
  startDate: string;
  endDate: string;
  conta: string;
  contas: Conta[];
  onStartDate: (v: string) => void;
  onEndDate: (v: string) => void;
  onConta: (v: string) => void;
  onClear: () => void;
  onApply: () => void;
}

export function LancamentosFilters({
  startDate, endDate, conta, contas,
  onStartDate, onEndDate, onConta,
  onClear, onApply,
}: LancamentosFiltersProps) {
  return (
    <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/30 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Filter size={15} className="text-primary" />
        <span className="text-label-sm font-semibold text-on-surface">Filtros</span>
      </div>

      <div className="flex flex-wrap gap-4">
        <Field label="Data Inicial" className="flex-1 min-w-[140px]">
          <DatePicker
            value={startDate ? parseDate(startDate) : null}
            onChange={(v: DateValue | null) => onStartDate(v ? v.toString() : "")}
          />
        </Field>

        <Field label="Data Final" className="flex-1 min-w-[140px]">
          <DatePicker
            value={endDate ? parseDate(endDate) : null}
            onChange={(v: DateValue | null) => onEndDate(v ? v.toString() : "")}
          />
        </Field>

        <Field label="Conta" className="flex-[2] min-w-[200px]">
          <Select
            value={conta}
            onChange={(e) => onConta(e.target.value)}
          >
            {contas.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClear}>
          <X size={14} /> Limpar
        </Button>
        <Button variant="primary" onClick={onApply}>
          <Filter size={14} /> Aplicar
        </Button>
      </div>
    </div>
  );
}

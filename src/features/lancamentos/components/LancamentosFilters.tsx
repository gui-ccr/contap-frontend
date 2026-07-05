import { Filter, X } from "lucide-react";
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
  const inputStyle = {
    background: "#242424",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#e5e2e1",
  };

  return (
    <div className="rounded-3xl p-4 md:p-6" style={{ background: "#1e1e1e" }}>
      <div className="flex items-center gap-2 mb-4">
        <Filter size={15} style={{ color: "#4edea3" }} />
        <span className="text-sm font-semibold" style={{ color: "#e5e2e1" }}>Filtros</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
            Data Inicial
          </label>
          <DatePicker
            value={startDate ? parseDate(startDate) : null}
            onChange={(v: DateValue | null) => onStartDate(v ? v.toString() : "")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
            Data Final
          </label>
          <DatePicker
            value={endDate ? parseDate(endDate) : null}
            onChange={(v: DateValue | null) => onEndDate(v ? v.toString() : "")}
          />
        </div>

        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
            Conta
          </label>
          <select
            value={conta}
            onChange={(e) => onConta(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none appearance-none"
            style={inputStyle}
          >
            {contas.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-medium transition-all hover:bg-white/5 cursor-pointer"
          style={{ color: "#6b7280", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <X size={13} />
          Limpar
        </button>
        <button
          onClick={onApply}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 cursor-pointer"
          style={{ background: "#4edea3", color: "#003824" }}
        >
          <Filter size={13} />
          Aplicar
        </button>
      </div>
    </div>
  );
}

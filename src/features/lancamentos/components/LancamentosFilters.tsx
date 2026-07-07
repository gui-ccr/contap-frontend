import { Filter, X } from "lucide-react";
import { Field, Select, Button } from "@/ui/forms";
import { DatePicker } from "@/ui/aria/application/date-picker/date-picker";
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
  activePreset?: string;
  onPreset: (preset: string, start: string, end: string) => void;
}

function toISO(d: Date) {
  return d.toISOString().split("T")[0];
}

const PRESETS = [
  {
    key: "mes-atual",
    label: "Este Mês",
    getRange: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start: toISO(start), end: toISO(end) };
    },
  },
  {
    key: "mes-passado",
    label: "Mês Passado",
    getRange: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start: toISO(start), end: toISO(end) };
    },
  },
  {
    key: "3-meses",
    label: "3 Meses",
    getRange: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start: toISO(start), end: toISO(end) };
    },
  },
  {
    key: "6-meses",
    label: "6 Meses",
    getRange: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start: toISO(start), end: toISO(end) };
    },
  },
  {
    key: "ano-atual",
    label: "Este Ano",
    getRange: () => {
      const now = new Date();
      return {
        start: `${now.getFullYear()}-01-01`,
        end: `${now.getFullYear()}-12-31`,
      };
    },
  },
  {
    key: "todos",
    label: "Todos",
    getRange: () => ({ start: "", end: "" }),
  },
];

export function LancamentosFilters({
  startDate, endDate, conta, contas,
  onStartDate, onEndDate, onConta,
  onClear, onApply, activePreset, onPreset,
}: LancamentosFiltersProps) {
  return (
    <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/30 flex flex-col gap-3">
      {/* Linha 1: título + atalhos */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 mr-2">
          <Filter size={13} className="text-primary" />
          <span className="text-label-sm font-semibold text-on-surface">Período</span>
        </div>

        {PRESETS.map((p) => {
          const isActive = activePreset === p.key;
          return (
            <button
              key={p.key}
              onClick={() => {
                const { start, end } = p.getRange();
                onPreset(p.key, start, end);
              }}
              className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
              style={{
                background: isActive
                  ? "rgba(0,230,118,0.18)"
                  : "rgba(255,255,255,0.05)",
                color: isActive ? "#00E676" : "#9ca3af",
                border: `1px solid ${isActive ? "rgba(0,230,118,0.4)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Linha 2: campos de data + conta */}
      <div className="flex flex-wrap gap-3 items-end">
        <Field label="Data Inicial" className="flex-1 min-w-[130px] max-w-[180px]">
          <DatePicker
            value={startDate ? parseDate(startDate) : null}
            onChange={(v: DateValue | null) => {
              onStartDate(v ? v.toString() : "");
            }}
          />
        </Field>

        <span className="text-on-surface-variant pb-2 text-xs">até</span>

        <Field label="Data Final" className="flex-1 min-w-[130px] max-w-[180px]">
          <DatePicker
            value={endDate ? parseDate(endDate) : null}
            onChange={(v: DateValue | null) => {
              onEndDate(v ? v.toString() : "");
            }}
          />
        </Field>

        <Field label="Conta" className="flex-[2] min-w-[180px]">
          <Select value={conta} onChange={(e) => onConta(e.target.value)}>
            {contas.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </Select>
        </Field>

        <div className="flex gap-2 pb-0.5">
          <Button variant="ghost" onClick={onClear}>
            <X size={13} /> Limpar
          </Button>
          <Button variant="primary" onClick={onApply}>
            <Filter size={13} /> Aplicar
          </Button>
        </div>
      </div>
    </div>
  );
}

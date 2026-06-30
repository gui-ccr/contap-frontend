import type { IndicatorItem } from "../types";

interface QuickIndicatorsProps {
  indicators: IndicatorItem[];
}

export function QuickIndicators({ indicators }: QuickIndicatorsProps) {
  return (
    <div className="rounded-3xl p-5" style={{ background: "#1e1e1e" }}>
      <h2 className="text-sm font-semibold text-white mb-4">Indicadores Rápidos</h2>
      <div className="flex flex-col gap-3">
        {indicators.map(({ id, label, value, meta, icon: Icon, ok }) => (
          <div
            key={id}
            className="flex items-center gap-3 p-3 rounded-2xl transition-all"
            style={{ background: "#242424" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: ok ? "#10b98118" : "#f4375418" }}
            >
              <Icon size={16} color={ok ? "#10b981" : "#f43754"} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-300">{label}</p>
              <p className="text-[10px] text-gray-600">{meta}</p>
            </div>
            <span className="text-sm font-bold shrink-0" style={{ color: ok ? "#10b981" : "#f43754" }}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

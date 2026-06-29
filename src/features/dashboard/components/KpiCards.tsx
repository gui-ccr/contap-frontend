import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { KpiItem } from "../types";

interface KpiCardsProps {
  data: KpiItem[];
}

export function KpiCards({ data }: KpiCardsProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {data.map(({ id, label, value, change, positive, icon: Icon, detail }) => (
        <div
          key={id}
          className="relative rounded-3xl p-5 overflow-hidden group transition-all duration-300"
          style={{ background: "#1e1e1e" }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: positive
                ? "radial-gradient(ellipse at top left,#10b98112 0%,transparent 70%)"
                : "radial-gradient(ellipse at top left,#f4375412 0%,transparent 70%)",
            }}
          />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</span>
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
              style={{ background: positive ? "#10b98120" : "#f4375420" }}
            >
              <Icon size={16} color={positive ? "#10b981" : "#f43754"} />
            </div>
          </div>
          <p className="text-xl font-bold text-white tracking-tight mb-2">{value}</p>
          <div className="flex items-center gap-1.5">
            {positive
              ? <ArrowUpRight size={13} color="#10b981" />
              : <ArrowDownRight size={13} color="#f43754" />}
            <span className="text-xs font-semibold" style={{ color: positive ? "#10b981" : "#f43754" }}>
              {change}
            </span>
            <span className="text-xs text-gray-600">{detail}</span>
          </div>
        </div>
      ))}
    </section>
  );
}

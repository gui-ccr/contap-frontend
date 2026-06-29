"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import type { MonthlyItem, CategoryItem } from "../types";

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl px-4 py-3 shadow-2xl text-sm" style={{ background: "#1a1a1a" }}>
      <p className="text-gray-400 font-medium mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-400 text-xs">{p.name === "receita" ? "Receita" : "Despesa"}:</span>
          <span className="text-white font-semibold text-xs">
            {p.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
        </div>
      ))}
    </div>
  );
}

interface MonthlyChartProps {
  data: MonthlyItem[];
  categories: CategoryItem[];
}

export function MonthlyChart({ data, categories }: MonthlyChartProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
      {/* Area chart — 2/3 */}
      <div className="lg:col-span-2 rounded-3xl p-5" style={{ background: "#1e1e1e" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-white">Desempenho Mensal</h2>
            <p className="text-xs text-gray-500 mt-0.5">Receita vs Despesa — 2025</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block" /> Receita
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block opacity-70" /> Despesa
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradReceita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradDespesa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
            <XAxis dataKey="mes" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={false} tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#ffffff10" }} />
            <Area type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2}
              fill="url(#gradReceita)" dot={false}
              activeDot={{ r: 5, fill: "#10b981", stroke: "#131313", strokeWidth: 2 }} />
            <Area type="monotone" dataKey="despesa" stroke="#f43f5e" strokeWidth={2}
              fill="url(#gradDespesa)" dot={false}
              activeDot={{ r: 5, fill: "#f43f5e", stroke: "#131313", strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue by category — 1/3 */}
      <div className="rounded-3xl p-5" style={{ background: "#1e1e1e" }}>
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-white">Receita por Categoria</h2>
          <p className="text-xs text-gray-500 mt-0.5">Distribuição — maio 2025</p>
        </div>
        <div className="flex flex-col gap-5">
          {categories.map((cat) => (
            <div key={cat.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-300">{cat.label}</span>
                <span className="text-xs font-semibold text-white">{cat.value}</span>
              </div>
              <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "#2a2a2a" }}>
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                  style={{ width: `${cat.pct}%`, background: cat.color }}
                />
              </div>
              <p className="text-[10px] text-gray-600 mt-1">{cat.pct}% do total</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

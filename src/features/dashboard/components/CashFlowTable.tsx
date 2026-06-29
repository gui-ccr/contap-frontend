import type { CashFlowRow } from "../types";

function StatusBadge({ status }: { status: string }) {
  const ok = status === "Confirmado";
  return (
    <span
      className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
      style={{ background: ok ? "#10b98118" : "#f59e0b18", color: ok ? "#10b981" : "#f59e0b" }}
    >
      {status}
    </span>
  );
}

interface CashFlowTableProps {
  rows: CashFlowRow[];
}

export function CashFlowTable({ rows }: CashFlowTableProps) {
  return (
    <section className="mb-6 rounded-3xl overflow-hidden" style={{ background: "#1e1e1e" }}>
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Fluxo de Caixa</h2>
          <p className="text-xs text-gray-500 mt-0.5">Últimos lançamentos</p>
        </div>
        <button
          className="text-xs font-medium px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
          style={{ color: "#10b981" }}
        >
          Ver todos →
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {["Descrição", "Tipo", "Data", "Valor", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-gray-600"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 text-gray-200 font-medium text-xs whitespace-nowrap">{row.descricao}</td>
                <td className="px-5 py-3.5">
                  <span
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: row.tipo === "entrada" ? "#10b98118" : "#f4375418",
                      color:      row.tipo === "entrada" ? "#10b981"   : "#f43754",
                    }}
                  >
                    {row.tipo === "entrada" ? "↑ Entrada" : "↓ Saída"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-gray-500 text-xs">{row.data}</td>
                <td
                  className="px-5 py-3.5 text-xs font-semibold"
                  style={{ color: row.tipo === "entrada" ? "#10b981" : "#f43754" }}
                >
                  {row.valor}
                </td>
                <td className="px-5 py-3.5"><StatusBadge status={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

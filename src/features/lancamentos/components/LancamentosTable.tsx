import { ChevronLeft, ChevronRight } from "lucide-react";

interface Lancamento {
  id: number;
  data: string;
  descricao: string;
  debito: string;
  credito: string;
  valor: string;
}

interface LancamentosTableProps {
  rows: Lancamento[];
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
}

export function LancamentosTable({ rows, page, totalPages, total, pageSize, onPage }: LancamentosTableProps) {
  const visiblePages = Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: "#1e1e1e" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Data", "Descrição", "Conta Débito", "Conta Crédito", "Valor (R$)"].map((h, i) => (
                <th
                  key={h}
                  className={`px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest ${i === 4 ? "text-right" : "text-left"}${[2, 3].includes(i) ? " hidden md:table-cell" : ""}`}
                  style={{ color: "#6b7280", background: "#1a1a1a" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="transition-colors cursor-default border-b"
                style={{ borderColor: "rgba(255,255,255,0.04)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td className="px-4 py-3 whitespace-nowrap font-mono text-xs font-medium" style={{ color: "#e5e2e1" }}>
                  {row.data}
                </td>
                <td className="px-4 py-3 text-xs font-medium max-w-[160px] md:max-w-none" style={{ color: "#e5e2e1" }}>
                  <span className="line-clamp-2 md:line-clamp-none">{row.descricao}</span>
                </td>
                <td className="hidden md:table-cell px-4 py-3 text-xs" style={{ color: "#6b7280" }}>
                  {row.debito}
                </td>
                <td className="hidden md:table-cell px-4 py-3 text-xs" style={{ color: "#6b7280" }}>
                  {row.credito}
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs font-semibold whitespace-nowrap" style={{ color: "#e5e2e1" }}>
                  {row.valor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        className="flex items-center justify-between px-4 py-3.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-xs hidden sm:block" style={{ color: "#6b7280" }}>
          <span style={{ color: "#e5e2e1" }}>{start}</span>
          {" – "}
          <span style={{ color: "#e5e2e1" }}>{end}</span>
          {" de "}
          <span style={{ color: "#e5e2e1" }}>{total}</span>
        </p>
        <p className="text-xs sm:hidden" style={{ color: "#6b7280" }}>
          Pág. <span style={{ color: "#e5e2e1" }}>{page}</span> / {totalPages}
        </p>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer"
            style={{ background: "#242424", color: "#6b7280" }}
          >
            <ChevronLeft size={14} />
          </button>

          {visiblePages.map((p) => (
            <button
              key={p}
              onClick={() => onPage(p)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold transition-all cursor-pointer"
              style={page === p
                ? { background: "#4edea3", color: "#003824" }
                : { background: "#242424", color: "#6b7280" }}
            >
              {p}
            </button>
          ))}

          {totalPages > 3 && (
            <>
              <span className="text-xs px-0.5" style={{ color: "#6b7280" }}>…</span>
              <button
                onClick={() => onPage(totalPages)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold transition-all cursor-pointer"
                style={{ background: "#242424", color: "#6b7280" }}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => onPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer"
            style={{ background: "#242424", color: "#6b7280" }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

import { ChevronLeft, ChevronRight } from "lucide-react";

interface UsuariosPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
}

export function UsuariosPagination({ page, totalPages, total, pageSize, onPage }: UsuariosPaginationProps) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const range: number[] = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
    range.push(i);
  }

  return (
    <div
      className="flex items-center justify-between px-4 py-3.5 rounded-3xl"
      style={{ background: "#1e1e1e" }}
    >
      <p className="text-xs" style={{ color: "#6b7280" }}>
        <span style={{ color: "#e5e2e1" }}>{start}</span>
        {" – "}
        <span style={{ color: "#e5e2e1" }}>{end}</span>
        {" de "}
        <span style={{ color: "#e5e2e1" }}>{total}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30"
          style={{ background: "#242424", color: "#6b7280" }}
        >
          <ChevronLeft size={14} />
        </button>

        {range[0] > 1 && (
          <>
            <button onClick={() => onPage(1)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold"
              style={{ background: "#242424", color: "#6b7280" }}>1</button>
            {range[0] > 2 && <span className="text-xs px-0.5" style={{ color: "#6b7280" }}>…</span>}
          </>
        )}

        {range.map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold transition-all"
            style={page === p ? { background: "#4edea3", color: "#003824" } : { background: "#242424", color: "#6b7280" }}
          >
            {p}
          </button>
        ))}

        {range[range.length - 1] < totalPages && (
          <>
            {range[range.length - 1] < totalPages - 1 && (
              <span className="text-xs px-0.5" style={{ color: "#6b7280" }}>…</span>
            )}
            <button onClick={() => onPage(totalPages)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold"
              style={{ background: "#242424", color: "#6b7280" }}>{totalPages}</button>
          </>
        )}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30"
          style={{ background: "#242424", color: "#6b7280" }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

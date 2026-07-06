import { ChevronLeft, ChevronRight } from "lucide-react";

interface FuncionariosPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
}

export function FuncionariosPagination({ page, totalPages, total, pageSize, onPage }: FuncionariosPaginationProps) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const range: number[] = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
    range.push(i);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3.5 rounded-3xl bg-surface-container-low border border-outline-variant/10">
      <p className="text-body-sm text-on-surface-variant/70">
        <span className="text-on-surface">{start}</span>
        {" – "}
        <span className="text-on-surface">{end}</span>
        {" de "}
        <span className="text-on-surface">{total}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30 bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
        >
          <ChevronLeft size={14} />
        </button>

        {range[0] > 1 && (
          <>
            <button onClick={() => onPage(1)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-label-sm font-semibold bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high">1</button>
            {range[0] > 2 && <span className="text-body-sm px-0.5 text-on-surface-variant/50">…</span>}
          </>
        )}

        {range.map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-label-sm font-semibold transition-all ${
              page === p ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            {p}
          </button>
        ))}

        {range[range.length - 1] < totalPages && (
          <>
            {range[range.length - 1] < totalPages - 1 && (
              <span className="text-body-sm px-0.5 text-on-surface-variant/50">…</span>
            )}
            <button onClick={() => onPage(totalPages)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-label-sm font-semibold bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high">{totalPages}</button>
          </>
        )}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30 bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

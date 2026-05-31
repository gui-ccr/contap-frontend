interface SubtotalRowProps {
  label: string;
  valor: string;
  color: string;
}

export function SubtotalRow({ label, valor, color }: SubtotalRowProps) {
  return (
    <div
      className="flex justify-between items-center py-2.5 px-3 rounded-xl mt-1"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <span className="text-xs font-semibold" style={{ color: "#6b7280" }}>{label}</span>
      <span className="text-sm font-bold font-mono" style={{ color }}>{valor}</span>
    </div>
  );
}

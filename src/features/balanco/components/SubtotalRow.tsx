interface SubtotalRowProps {
  label: string;
  valor: string;
  color: string;
}

export function SubtotalRow({ label, valor, color }: SubtotalRowProps) {
  return (
    <div
      className="flex justify-between items-center py-3 px-4 rounded-xl mt-1 transition-all"
      style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)" }}
    >
      <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#9ca3af" }}>{label}</span>
      <span className="text-sm font-black tracking-tight font-mono" style={{ color }}>{valor}</span>
    </div>
  );
}

interface SectionHeaderProps {
  label: string;
  color: string;
}

export function SectionHeader({ label, color }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2.5 mb-3 px-1">
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}80` }} />
      <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#9ca3af" }}>
        {label}
      </span>
      <div className="flex-1 h-[1px]" style={{ background: "linear-gradient(to right, rgba(255,255,255,0.06), transparent)" }} />
    </div>
  );
}

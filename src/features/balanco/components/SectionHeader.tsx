interface SectionHeaderProps {
  label: string;
  color: string;
}

export function SectionHeader({ label, color }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-0.5 h-4 rounded-full" style={{ background: color }} />
      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#6b7280" }}>
        {label}
      </span>
    </div>
  );
}

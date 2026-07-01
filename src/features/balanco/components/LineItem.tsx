interface LineItemProps {
  label: string;
  valor: string;
  muted?: boolean;
}

export function LineItem({ label, valor, muted }: LineItemProps) {
  return (
    <div className="flex justify-between items-center py-2.5 px-3 rounded-xl transition-all duration-200 hover:bg-white/5 group">
      <span className="text-sm font-medium transition-colors" style={{ color: muted ? "#6b7280" : "#d1d5db" }}>
        {label}
      </span>
      <div className="flex-1 mx-4 border-b border-dashed border-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="text-sm font-bold font-mono tracking-tight transition-colors" style={{ color: muted ? "#6b7280" : "#f3f4f6" }}>
        {valor}
      </span>
    </div>
  );
}

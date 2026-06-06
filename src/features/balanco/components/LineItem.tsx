interface LineItemProps {
  label: string;
  valor: string;
  muted?: boolean;
}

export function LineItem({ label, valor, muted }: LineItemProps) {
  return (
    <div
      className="flex justify-between items-center py-2.5 px-3 rounded-xl transition-colors"
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span className="text-sm" style={{ color: muted ? "#6b7280" : "#e5e2e1" }}>{label}</span>
      <span className="text-sm font-semibold font-mono" style={{ color: muted ? "#6b7280" : "#e5e2e1" }}>
        {valor}
      </span>
    </div>
  );
}

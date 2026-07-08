import { Download } from "lucide-react";
import { Button } from "@/ui/forms";

interface BalancoHeaderProps {
  today: string;
  onExport?: () => void;
}

export function BalancoHeader({ today, onExport }: BalancoHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-headline-md tracking-tight">
          Balanço Patrimonial
        </h1>
        <p className="text-body-sm text-on-surface-variant/70 mt-1">
          Posição financeira em {today} (inclui lucro/prejuízo acumulado desde o início das operações)
        </p>
      </div>
      <Button
        variant="tonal"
        className="self-start md:self-auto shadow-sm"
        onClick={onExport}
      >
        <Download size={15} />
        Exportar PDF
      </Button>
    </div>
  );
}

import { Calendar } from "lucide-react";
import { DatePicker } from "@/src/ui/application/date-picker/date-picker";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "react-aria-components";
import { Button } from "@/ui/forms";
interface DashboardFiltersProps {
  startDate: string;
  endDate: string;
  onChangeRange: (start: string, end: string) => void;
}

export function DashboardFilters({ startDate, endDate, onChangeRange }: DashboardFiltersProps) {
  const getToday = () => new Date();

  const handleShortcut = (months: number) => {
    const end = getToday();
    const start = new Date(end);
    start.setMonth(start.getMonth() - months);
    
    onChangeRange(
      start.toISOString().split("T")[0],
      end.toISOString().split("T")[0]
    );
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 mb-6 bg-surface-container-low p-3 rounded-2xl border border-outline-variant/20">
      <div className="flex items-center gap-2">
        <Button 
          variant="tonal"
          onClick={() => handleShortcut(1)}
          className="!px-3 !py-1.5 !text-xs"
        >
          30 Dias
        </Button>
        <Button 
          variant="tonal"
          onClick={() => handleShortcut(3)}
          className="!px-3 !py-1.5 !text-xs"
        >
          3 Meses
        </Button>
        <Button 
          variant="tonal"
          onClick={() => handleShortcut(6)}
          className="!px-3 !py-1.5 !text-xs"
        >
          6 Meses
        </Button>
        <Button 
          variant="tonal"
          onClick={() => handleShortcut(12)}
          className="!px-3 !py-1.5 !text-xs"
        >
          12 Meses
        </Button>
      </div>

      <div className="w-px h-6 bg-white/10 hidden md:block mx-2" />

      <div className="flex items-center gap-2 w-full md:w-auto">
        <Calendar size={14} className="text-gray-500" />
        <DatePicker
          value={startDate ? parseDate(startDate) : null}
          onChange={(v: DateValue | null) => onChangeRange(v ? v.toString() : "", endDate)}
        />
        <span className="text-gray-500 text-xs">até</span>
        <DatePicker
          value={endDate ? parseDate(endDate) : null}
          onChange={(v: DateValue | null) => onChangeRange(startDate, v ? v.toString() : "")}
        />
      </div>
    </div>
  );
}

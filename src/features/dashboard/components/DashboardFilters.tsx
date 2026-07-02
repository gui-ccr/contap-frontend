import { Calendar } from "lucide-react";

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
    <div className="flex flex-col md:flex-row items-center gap-3 mb-6 bg-[#1a1a1a] p-3 rounded-2xl border border-white/5">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => handleShortcut(1)}
          className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#252525] hover:bg-[#303030] text-gray-300 transition-colors"
        >
          30 Dias
        </button>
        <button 
          onClick={() => handleShortcut(3)}
          className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#252525] hover:bg-[#303030] text-gray-300 transition-colors"
        >
          3 Meses
        </button>
        <button 
          onClick={() => handleShortcut(6)}
          className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#252525] hover:bg-[#303030] text-gray-300 transition-colors"
        >
          6 Meses
        </button>
        <button 
          onClick={() => handleShortcut(12)}
          className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#252525] hover:bg-[#303030] text-gray-300 transition-colors"
        >
          12 Meses
        </button>
      </div>

      <div className="w-px h-6 bg-white/10 hidden md:block mx-2" />

      <div className="flex items-center gap-2 w-full md:w-auto">
        <Calendar size={14} className="text-gray-500" />
        <input 
          type="date" 
          value={startDate}
          onChange={(e) => onChangeRange(e.target.value, endDate)}
          className="bg-transparent border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#10b981]"
        />
        <span className="text-gray-500 text-xs">até</span>
        <input 
          type="date" 
          value={endDate}
          onChange={(e) => onChangeRange(startDate, e.target.value)}
          className="bg-transparent border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#10b981]"
        />
      </div>
    </div>
  );
}

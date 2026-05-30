export function KpiCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-[#1e1e1e] p-6 rounded-xl border border-white/5">
        <p className="text-gray-400 text-sm">Saldo Consolidado</p>
        <p className="text-white text-2xl font-bold mt-2">R$ 2.450.120,00</p>
      </div>
      <div className="bg-[#1e1e1e] p-6 rounded-xl border border-white/5">
        <p className="text-gray-400 text-sm">Receitas do Mês</p>
        <p className="text-[#10b981] text-2xl font-bold mt-2">+ R$ 124.500,00</p>
      </div>
      <div className="bg-[#1e1e1e] p-6 rounded-xl border border-white/5">
        <p className="text-gray-400 text-sm">Despesas Totais</p>
        <p className="text-white text-2xl font-bold mt-2">- R$ 45.200,00</p>
      </div>
    </div>
  );
}
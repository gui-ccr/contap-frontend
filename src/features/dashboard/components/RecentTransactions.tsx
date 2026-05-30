export function RecentTransactions() {
  // Dados falsos (mock) para o seu frontend
  const transactions = [
    { id: 1, title: "Office Supplies", date: "Oct 20", category: "Despesas Adm.", amount: "- R$ 340,20", status: "Pendente" },
    { id: 2, title: "Assinatura Software", date: "Oct 19", category: "Tecnologia", amount: "- R$ 1.200,00", status: "Pago" },
    { id: 3, title: "Venda de Pizza", date: "Oct 18", category: "Receita", amount: "+ R$ 850,00", status: "Pago" },
  ];

  return (
    <div className="bg-[#1e1e1e] rounded-xl border border-white/5 p-6 h-full shadow-lg">
      <h3 className="text-white font-bold mb-6">Lançamentos Recentes</h3>
      
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-white/5 rounded transition-colors border border-transparent hover:border-white/5">
            <div className="flex items-center gap-3">
              {/* Ícone fixo para simular o design */}
              <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-400 text-[20px]">receipt</span>
              </div>
              <div>
                <div className="text-white text-sm font-medium">{tx.title}</div>
                <div className="text-gray-500 text-xs flex items-center gap-1">
                  {tx.date} • {tx.category}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-sm font-semibold ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-white'}`}>
                {tx.amount}
              </div>
              <div className={`text-[10px] px-2 py-0.5 rounded inline-block mt-1 ${
                tx.status === 'Pago' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'
              }`}>
                {tx.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
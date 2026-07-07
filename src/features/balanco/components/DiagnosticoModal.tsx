import { X, AlertTriangle, CheckCircle } from "lucide-react";

interface DiagnosticoItem {
  lancamentoId: string;
  dataLancamento: string;
  descricao: string;
  erro: string;
}

interface IDiagnosticoRelatorio {
  totalLancamentos: number;
  totalPartidas: number;
  totalDivergencias: number;
  divergencias: DiagnosticoItem[];
}

interface DiagnosticoModalProps {
  isOpen: boolean;
  onClose: () => void;
  relatorio: IDiagnosticoRelatorio | null;
  loading: boolean;
}

export function DiagnosticoModal({ isOpen, onClose, relatorio, loading }: DiagnosticoModalProps) {
  if (!isOpen) return null;

  const hasDivergencias = relatorio ? relatorio.divergencias.length > 0 : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-3xl max-h-[85vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden"
        style={{ background: "#121212", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${hasDivergencias ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
              <AlertTriangle size={20} className={hasDivergencias ? 'text-red-500' : 'text-emerald-500'} />
            </div>
            <h2 className="text-xl font-medium text-white">Diagnóstico Contábil</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400 animate-pulse">Varrendo banco de dados e conferindo partidas...</p>
            </div>
          ) : !relatorio ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-gray-400 mt-2">Nenhum dado encontrado.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Resumo */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Lançamentos</span>
                  <span className="text-2xl font-bold text-white">{relatorio.totalLancamentos}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Partidas</span>
                  <span className="text-2xl font-bold text-white">{relatorio.totalPartidas}</span>
                </div>
                <div className={`p-4 rounded-2xl border flex flex-col items-center text-center ${hasDivergencias ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                  <span className={`text-xs font-medium uppercase tracking-wider mb-1 ${hasDivergencias ? 'text-red-400' : 'text-emerald-400'}`}>Divergências</span>
                  <span className={`text-2xl font-bold ${hasDivergencias ? 'text-red-400' : 'text-emerald-400'}`}>{relatorio.totalDivergencias}</span>
                </div>
              </div>

              {!hasDivergencias ? (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                  <div className="p-3 rounded-full bg-emerald-500/10 mb-3">
                    <CheckCircle size={28} className="text-emerald-500" />
                  </div>
                  <p className="text-emerald-400 font-medium text-lg">Banco de dados perfeito!</p>
                  <p className="text-sm text-gray-400 mt-1 max-w-md">Todos os lançamentos analisados estão com suas partidas dobradas (débitos e créditos) perfeitamente equilibradas e apontando para contas válidas.</p>
                </div>
              ) : (
                <div className="space-y-4 mt-8">
                  <h3 className="text-sm font-medium text-white mb-4 border-b border-white/10 pb-2">Detalhes dos Problemas Encontrados</h3>
                  {relatorio.divergencias.map((diag, index) => (
                    <div 
                      key={diag.lancamentoId || index} 
                      className="p-5 rounded-2xl bg-white/[0.02] border border-red-500/20"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-gray-200">{diag.descricao || "Lançamento sem descrição"}</h3>
                        <span className="text-xs text-gray-500 font-mono bg-black/40 px-2 py-1 rounded-md">
                          {new Date(diag.dataLancamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                        </span>
                      </div>
                      
                      <div className="flex items-start gap-2 text-sm bg-red-500/5 p-3 rounded-xl">
                        <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-red-300/90 leading-relaxed">{diag.erro}</p>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                        <p className="text-[10px] text-gray-500 font-mono">ID Lançamento: {diag.lancamentoId}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-white/5 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-sm font-medium bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

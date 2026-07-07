import { X, AlertTriangle } from "lucide-react";

interface DiagnosticoItem {
  lancamentoId: string;
  dataLancamento: string;
  descricao: string;
  erro: string;
}

interface DiagnosticoModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosticos: DiagnosticoItem[];
  loading: boolean;
}

export function DiagnosticoModal({ isOpen, onClose, diagnosticos, loading }: DiagnosticoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-3xl max-h-[85vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden"
        style={{ background: "#121212", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full" style={{ background: "#ff525218" }}>
              <AlertTriangle size={20} style={{ color: "#ff5252" }} />
            </div>
            <h2 className="text-xl font-medium text-white">Diagnóstico de Lançamentos</h2>
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
              <p className="text-sm text-gray-400 animate-pulse">Analisando lançamentos contábeis...</p>
            </div>
          ) : diagnosticos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-emerald-500/10 mb-4">
                <AlertTriangle size={32} className="text-emerald-500" />
              </div>
              <p className="text-emerald-400 font-medium text-lg">Nenhuma divergência encontrada!</p>
              <p className="text-sm text-gray-400 mt-2">Todos os seus lançamentos estão com as partidas dobradas perfeitamente equilibradas.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-400 mb-6">
                Foram encontrados <strong className="text-white">{diagnosticos.length}</strong> lançamentos com problemas (corrompidos ou incompletos).
              </p>
              {diagnosticos.map((diag, index) => (
                <div 
                  key={diag.lancamentoId || index} 
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-200">{diag.descricao || "Lançamento sem descrição"}</h3>
                    <span className="text-xs text-gray-500 font-mono bg-black/40 px-2 py-1 rounded-md">
                      {new Date(diag.dataLancamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-red-400 mt-0.5">•</span>
                    <p className="text-red-300/90 leading-relaxed">{diag.erro}</p>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <p className="text-[10px] text-gray-500 font-mono">ID: {diag.lancamentoId}</p>
                  </div>
                </div>
              ))}
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

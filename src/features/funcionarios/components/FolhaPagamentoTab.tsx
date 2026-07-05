"use client";

import { useState, useEffect } from "react";
import { funcionariosService } from "../funcionariosService";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/format";
import { FileText, Play } from "lucide-react";
import { FecharFolhaModal } from "./FecharFolhaModal";
import { HoleriteModal } from "./HoleriteModal";
import { Button } from "@/ui/forms";

export function FolhaPagamentoTab() {
  const [folhaModalOpen, setFolhaModalOpen] = useState(false);
  const [selectedHolerite, setSelectedHolerite] = useState<any | null>(null);
  const [holerites, setHolerites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const dataAtual = new Date();
  const [mes, setMes] = useState(dataAtual.getMonth() + 1);
  const [ano, setAno] = useState(dataAtual.getFullYear());

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  async function carregarHolerites() {
    try {
      setLoading(true);
      const data = await funcionariosService.listarHolerites(mes, ano);
      setHolerites(data);
    } catch (err) {
      console.error("Erro ao carregar holerites:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void carregarHolerites();
  }, [mes, ano]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl" style={{ background: "#1e1e1e" }}>
        <div>
          <h2 className="text-lg font-bold text-gray-200 mb-1">Painel de Folha de Pagamento</h2>
          <p className="text-sm text-gray-500">Visualize e processe o fechamento mensal da folha (Salários, INSS, FGTS).</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select 
            value={mes} 
            onChange={(e) => setMes(Number(e.target.value))}
            className="bg-[#2a2a2a] text-sm text-gray-200 px-3 py-2 rounded-xl outline-none"
          >
            {meses.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select 
            value={ano} 
            onChange={(e) => setAno(Number(e.target.value))}
            className="bg-[#2a2a2a] text-sm text-gray-200 px-3 py-2 rounded-xl outline-none"
          >
            {[ano - 1, ano, ano + 1].map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <Button onClick={() => setFolhaModalOpen(true)} className="!px-4 !py-2 !rounded-xl !bg-[#4edea3] !text-[#003824]">
            <Play size={14} strokeWidth={2.5} />
            Rodar Fechamento
          </Button>
        </div>
      </div>

      <div className="rounded-3xl overflow-hidden" style={{ background: "#1e1e1e" }}>
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">Carregando espelho da folha...</div>
        ) : holerites.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <FileText size={40} className="text-gray-600" />
            <p className="text-sm font-medium text-gray-500">Nenhuma folha fechada para este mês.</p>
            <p className="text-xs text-gray-600">Clique em "Rodar Fechamento" para gerar os holerites e impostos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Funcionário", "Salário Bruto", "Descontos (INSS/IR/Ben.)", "Líquido a Pagar", ""].map((h) => (
                    <th key={h} className={`px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider ${h === "" ? "text-right" : ""}`} style={{ color: "#6b7280", background: "#1a1a1a" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {holerites.map((h) => (
                  <tr key={h.id} className="group border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-medium text-gray-200">{h.funcionarios?.nome}</p>
                      <p className="text-xs text-gray-500">{h.funcionarios?.cargo}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-300 font-medium">
                      {formatCurrency(h.salario_bruto)}
                    </td>
                    <td className="px-5 py-4 text-red-400 font-medium">
                      - {formatCurrency(h.total_descontos)}
                    </td>
                    <td className="px-5 py-4 text-[#4edea3] font-bold">
                      {formatCurrency(h.salario_liquido)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button 
                        onClick={() => setSelectedHolerite(h)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
                      >
                        Ver Holerite
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {folhaModalOpen && (
        <FecharFolhaModal
          onClose={() => setFolhaModalOpen(false)}
          onSuccess={(msg, selectedMes, selectedAno) => {
            toast.success(msg);
            setFolhaModalOpen(false);
            setMes(selectedMes);
            setAno(selectedAno);
            // carregarHolerites will be triggered automatically by the useEffect watching [mes, ano]
          }}
        />
      )}

      {selectedHolerite && (
        <HoleriteModal
          holerite={selectedHolerite}
          onClose={() => setSelectedHolerite(null)}
        />
      )}
    </div>
  );
}

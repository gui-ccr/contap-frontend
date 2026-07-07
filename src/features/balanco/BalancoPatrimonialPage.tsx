/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { BalancoHeader } from "./components/BalancoHeader";
import { AtivoSection } from "./components/AtivoSection";
import { exportBalancoToPDF } from "@/utils/pdfExport";
import { toast } from "sonner";
import { PassivoSection } from "./components/PassivoSection";
import { EquationFooter } from "./components/EquationFooter";
import { balancoService } from "./balancoService";
import { DiagnosticoModal } from "./components/DiagnosticoModal";
import { Search } from "lucide-react";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BalancoPatrimonialPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [diagnosticos, setDiagnosticos] = useState<any[]>([]);
  const [diagnosticoLoading, setDiagnosticoLoading] = useState(false);

  const today = new Date().toLocaleDateString("pt-BR", {
    day: "numeric", month: "long", year: "numeric",
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  // Guardamos os dados numéricos antes da formatação para uso na exportação
  const [rawData, setRawData] = useState<any>(null);

  const handleExport = async () => {
    if (!rawData) return;
    try {
      toast.loading("Gerando PDF...", { id: "pdf-toast" });
      await exportBalancoToPDF(rawData, today);
      toast.success("PDF gerado com sucesso!", { id: "pdf-toast" });
    } catch (err) {
      toast.error("Erro ao gerar PDF.", { id: "pdf-toast" });
    }
  };

  const handleOpenDiagnostico = async () => {
    setIsModalOpen(true);
    setDiagnosticoLoading(true);
    try {
      const res = await balancoService.obterDiagnostico();
      setDiagnosticos(res);
    } catch (err) {
      toast.error("Erro ao carregar diagnóstico.");
    } finally {
      setDiagnosticoLoading(false);
    }
  };

  useEffect(() => {
    async function loadBalanco() {
      try {
        setLoading(true);
        setError(null);
        const res = await balancoService.obterBalanco();
        
        // Salva os dados numéricos para exportação antes de formatar
        setRawData(res);
        // Formatar valores para string conforme esperado pelos componentes visuais
        const formatted = {
          ativoCirculante: res.ativoCirculante.map(i => ({ label: i.label, valor: formatCurrency(i.valor) })),
          ativoNaoCirculante: res.ativoNaoCirculante.map(i => ({ label: i.label, valor: formatCurrency(i.valor) })),
          passivoCirculante: res.passivoCirculante.map(i => ({ label: i.label, valor: formatCurrency(i.valor) })),
          passivoNaoCirculante: res.passivoNaoCirculante.map(i => ({ label: i.label, valor: formatCurrency(i.valor) })),
          patrimonioLiquido: res.patrimonioLiquido.map(i => ({ label: i.label, valor: formatCurrency(i.valor) })),
          totalAtivo: formatCurrency(res.totalAtivo),
          totalPassivo: formatCurrency(res.totalPassivo),
          equacaoValida: res.equacaoValida,
          // Subtotais calculados
          totalCirculanteAtivo: formatCurrency(res.ativoCirculante.reduce((acc, i) => acc + i.valor, 0)),
          totalNaoCirculanteAtivo: formatCurrency(res.ativoNaoCirculante.reduce((acc, i) => acc + i.valor, 0)),
          totalCirculantePassivo: formatCurrency(res.passivoCirculante.reduce((acc, i) => acc + i.valor, 0)),
          totalNaoCirculantePassivo: formatCurrency(res.passivoNaoCirculante.reduce((acc, i) => acc + i.valor, 0)),
          totalPatrimonio: formatCurrency(res.patrimonioLiquido.reduce((acc, i) => acc + i.valor, 0)),
        };
        setData(formatted);
      } catch (err) {
        console.error("Falha ao carregar Balanço Patrimonial da API:", err);
        setError(err instanceof Error ? err.message : "Falha ao carregar o Balanço Patrimonial.");
      } finally {
        setLoading(false);
      }
    }
    loadBalanco();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-6xl mx-auto space-y-5">

          <BalancoHeader today={today} onExport={handleExport} />
          
          <div className="flex justify-end">
            <button 
              onClick={handleOpenDiagnostico}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-full transition-colors text-sm font-medium border border-indigo-500/20 cursor-pointer"
            >
              <Search size={16} />
              Rodar Diagnóstico
            </button>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400 animate-pulse">Carregando Balanço Patrimonial...</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center">
              <p className="text-red-400 font-medium">{error}</p>
              <p className="text-sm text-gray-400 mt-1">Verifique sua conexão e se o login está ativo, depois recarregue a página.</p>
            </div>
          )}

          {!loading && !error && data && (
            <div id="balanco-report-content">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AtivoSection
                  circulante={data.ativoCirculante}
                  naoCirculante={data.ativoNaoCirculante}
                  totalCirculante={data.totalCirculanteAtivo}
                  totalNaoCirculante={data.totalNaoCirculanteAtivo}
                  totalAtivo={data.totalAtivo}
                />
                <PassivoSection
                  circulante={data.passivoCirculante}
                  naoCirculante={data.passivoNaoCirculante}
                  patrimonioLiquido={data.patrimonioLiquido}
                  totalCirculante={data.totalCirculantePassivo}
                  totalNaoCirculante={data.totalNaoCirculantePassivo}
                  totalPatrimonio={data.totalPatrimonio}
                  totalPassivo={data.totalPassivo}
                />
              </div>

              <EquationFooter totalAtivo={data.totalAtivo} totalPassivo={data.totalPassivo} equacaoValida={data.equacaoValida} />
            </div>
          )}

        </div>
      </main>

      <DiagnosticoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        diagnosticos={diagnosticos}
        loading={diagnosticoLoading}
      />
    </div>
  );
}

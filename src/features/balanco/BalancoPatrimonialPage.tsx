"use client";

import { useState, useEffect } from "react";
import { BalancoHeader } from "./components/BalancoHeader";
import { AtivoSection } from "./components/AtivoSection";
import { PassivoSection } from "./components/PassivoSection";
import { EquationFooter } from "./components/EquationFooter";
import { balancoService } from "./balancoService";

// ─── Mock data (Fallback) ──────────────────────────────────────────────────────

const ATIVO_CIRCULANTE = [
  { label: "Caixa e Equivalentes", valor: "R$ 1.245.000,00" },
  { label: "Contas a Receber",     valor: "R$ 850.500,00"   },
  { label: "Estoques",             valor: "R$ 420.000,00"   },
];

const ATIVO_NAO_CIRCULANTE = [
  { label: "Imobilizado",   valor: "R$ 3.100.000,00" },
  { label: "Intangível",    valor: "R$ 550.000,00"   },
  { label: "Investimentos", valor: "R$ 800.000,00"   },
];

const PASSIVO_CIRCULANTE = [
  { label: "Fornecedores",           valor: "R$ 620.000,00" },
  { label: "Obrigações Fiscais",     valor: "R$ 185.000,00" },
  { label: "Empréstimos Curto Prazo", valor: "R$ 350.000,00" },
];

const PASSIVO_NAO_CIRCULANTE = [
  { label: "Financiamentos Longo Prazo", valor: "R$ 1.800.000,00" },
  { label: "Provisões",                  valor: "R$ 210.500,00"   },
];

const PATRIMONIO_LIQUIDO = [
  { label: "Capital Social",    valor: "R$ 3.000.000,00" },
  { label: "Reservas de Lucro", valor: "R$ 800.000,00"   },
];

const TOTAL_ATIVO   = "R$ 6.965.500,00";
const TOTAL_PASSIVO = "R$ 6.965.500,00";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BalancoPatrimonialPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("pt-BR", {
    day: "numeric", month: "long", year: "numeric",
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  useEffect(() => {
    async function loadBalanco() {
      try {
        setLoading(true);
        const res = await balancoService.obterBalanco();
        
        // Formatar valores para string conforme esperado pelos componentes visuais
        const formatted = {
          ativoCirculante: res.ativoCirculante.map(i => ({ label: i.label, valor: formatCurrency(i.valor) })),
          ativoNaoCirculante: res.ativoNaoCirculante.map(i => ({ label: i.label, valor: formatCurrency(i.valor) })),
          passivoCirculante: res.passivoCirculante.map(i => ({ label: i.label, valor: formatCurrency(i.valor) })),
          passivoNaoCirculante: res.passivoNaoCirculante.map(i => ({ label: i.label, valor: formatCurrency(i.valor) })),
          patrimonioLiquido: res.patrimonioLiquido.map(i => ({ label: i.label, valor: formatCurrency(i.valor) })),
          totalAtivo: formatCurrency(res.totalAtivo),
          totalPassivo: formatCurrency(res.totalPassivo),
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

          <BalancoHeader today={today} />

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400 animate-pulse">Carregando Balanço Patrimonial...</p>
            </div>
          )}

          {!loading && data && (
            <>
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

              <EquationFooter totalAtivo={data.totalAtivo} totalPassivo={data.totalPassivo} />
            </>
          )}

        </div>
      </main>
    </div>
  );
}

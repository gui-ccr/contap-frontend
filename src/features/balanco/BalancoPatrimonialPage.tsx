"use client";

import { BalancoHeader } from "./components/BalancoHeader";
import { AtivoSection } from "./components/AtivoSection";
import { PassivoSection } from "./components/PassivoSection";
import { EquationFooter } from "./components/EquationFooter";

// ─── Mock data ────────────────────────────────────────────────────────────────

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
  const today = new Date().toLocaleDateString("pt-BR", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-6xl mx-auto space-y-5">

          <BalancoHeader today={today} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AtivoSection
              circulante={ATIVO_CIRCULANTE}
              naoCirculante={ATIVO_NAO_CIRCULANTE}
              totalCirculante="R$ 2.515.500,00"
              totalNaoCirculante="R$ 4.450.000,00"
              totalAtivo={TOTAL_ATIVO}
            />
            <PassivoSection
              circulante={PASSIVO_CIRCULANTE}
              naoCirculante={PASSIVO_NAO_CIRCULANTE}
              patrimonioLiquido={PATRIMONIO_LIQUIDO}
              totalCirculante="R$ 1.155.000,00"
              totalNaoCirculante="R$ 2.010.500,00"
              totalPatrimonio="R$ 3.800.000,00"
              totalPassivo={TOTAL_PASSIVO}
            />
          </div>

          <EquationFooter totalAtivo={TOTAL_ATIVO} totalPassivo={TOTAL_PASSIVO} />

        </div>
      </main>
    </div>
  );
}

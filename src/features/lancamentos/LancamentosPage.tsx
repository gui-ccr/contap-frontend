"use client";

import { useState, useEffect } from "react";
import { LancamentosFilters } from "./components/LancamentosFilters";
import { LancamentosTable } from "./components/LancamentosTable";
import { Download } from "lucide-react";
import { lancamentosService, LancamentoBackend } from "./lancamentosService";
import { exportLivroDiarioToPDF } from "@/utils/pdfExport";
import { toast } from "sonner";
import { Button } from "@/ui/forms";

const CONTAS = [
  { value: "all", label: "Todas as Contas" },
  { value: "1.1.01.01", label: "1.1.01.01 — Banco Itaú C/C" },
  { value: "3.1.01.01", label: "3.1.01.01 — Receitas de Serviços" },
  { value: "4.1.01.02", label: "4.1.01.02 — Despesas Administrativas" },
  { value: "2.1.01.01", label: "2.1.01.01 — Fornecedores Nacionais" },
];

const PAGE_SIZE = 5;

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function toISO(d: Date) {
  return d.toISOString().split("T")[0];
}

function getMesAtualRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: toISO(start), end: toISO(end) };
}

export default function LancamentosPage() {
  const mesAtual = getMesAtualRange();
  const [startDate, setStartDate] = useState(mesAtual.start);
  const [endDate, setEndDate] = useState(mesAtual.end);
  const [activePreset, setActivePreset] = useState("mes-atual");
  const [conta, setConta] = useState("all");
  const [page, setPage] = useState(1);
  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarLancamentos = async () => {
    try {
      setLoading(true);
      const data = await lancamentosService.listarLancamentos();
      
      const formatados = data.map(l => {
        const d = new Date(l.dataLancamento);
        const dataStr = d.toLocaleDateString("pt-BR");
        
        const debito = l.partidas.find(p => p.tipo === "D");
        const credito = l.partidas.find(p => p.tipo === "C");
        
        return {
          id: l.id,
          data: dataStr,
          dataObj: d,
          descricao: l.descricao,
          debito: debito?.contaId || "-",
          credito: credito?.contaId || "-",
          valor: formatCurrency(debito?.valor || credito?.valor || 0),
          valorNum: debito?.valor || credito?.valor || 0,
        };
      });
      setLancamentos(formatados);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarLancamentos();
  }, []);

  function parseBR(d: string) {
    const [day, month, year] = d.split("/");
    return new Date(`${year}-${month}-${day}T12:00:00Z`);
  }

  const filtered = lancamentos.filter((l) => {
    const date = l.dataObj;
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;
    if (from && date < from) return false;
    if (to && date > to) return false;
    if (conta !== "all") {
      const contaId = conta.split(" ")[0];
      if (!l.debito.startsWith(contaId) && !l.credito.startsWith(contaId))
        return false;
    }
    return true;
  });

  // Volume total movimentado (soma de todos os valores dos lançamentos filtrados)
  const volumeTotal = filtered.reduce((acc, l) => acc + l.valorNum, 0);

  // Quantidade total de lançamentos no período filtrado
  const qtdLancamentos = filtered.length;

  // Maior lançamento do período
  const maiorLancamento = filtered.reduce(
    (max, l) => (l.valorNum > max.valorNum ? l : max),
    { valorNum: 0, descricao: "-", data: "-" }
  );

  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function clearFilters() {
    const { start, end } = getMesAtualRange();
    setStartDate(start);
    setEndDate(end);
    setActivePreset("mes-atual");
    setConta("all");
    setPage(1);
  }

  function handlePreset(preset: string, start: string, end: string) {
    setActivePreset(preset);
    setStartDate(start);
    setEndDate(end);
    setPage(1);
  }

  const handleExport = async () => {
    try {
      toast.loading("Gerando Livro Diário em PDF...", { id: "pdf-toast" });
      const pText = (startDate && endDate)
        ? `${startDate} a ${endDate}`
        : startDate ? `A partir de ${startDate}` : endDate ? `Até ${endDate}` : "Todo o período";
      // Exporta todos os registros filtrados (não só a página atual)
      await exportLivroDiarioToPDF(
        filtered.map((r) => ({
          data: r.data,
          descricao: r.descricao,
          debito: r.debito,
          credito: r.credito,
          valor: r.valor,
        })),
        pText
      );
      toast.success("PDF gerado com sucesso!", { id: "pdf-toast" });
    } catch (err) {
      toast.error("Erro ao gerar PDF.", { id: "pdf-toast" });
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Cabeçalho */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium" style={{ color: "#6b7280" }}>
                Visão Geral
              </p>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                Lançamentos Contábeis
              </h1>
            </div>
            <Button
              variant="tonal"
              className="self-start sm:self-auto shadow-sm"
              onClick={handleExport}
            >
              <Download size={15} />
              Exportar Livro Diário
            </Button>
          </header>

          <div id="lancamentos-report-content" className="space-y-4 w-full">
            {/* KPIs compactos em linha */}
            <div className="grid grid-cols-3 gap-3">
            {/* Card 1: Volume Total */}
            <div
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: "#1e1e1e" }}
            >
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
                  Volume Total
                </span>
                <div className="w-6 h-6 rounded-xl flex items-center justify-center" style={{ background: "rgba(78,222,163,0.12)" }}>
                  <svg className="w-3 h-3" fill="none" stroke="#4edea3" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-lg font-bold text-white tracking-tight">R$ {formatCurrency(volumeTotal)}</p>
                <p className="text-[10px] mt-0.5 font-medium" style={{ color: "#4edea3" }}>Movimentado no período</p>
              </div>
            </div>

            {/* Card 2: Quantidade */}
            <div
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: "#1e1e1e" }}
            >
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
                  Lançamentos
                </span>
                <div className="w-6 h-6 rounded-xl flex items-center justify-center" style={{ background: "rgba(147,112,219,0.15)" }}>
                  <svg className="w-3 h-3" fill="none" stroke="#9370db" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-lg font-bold text-white tracking-tight">{qtdLancamentos}</p>
                <p className="text-[10px] mt-0.5 font-medium" style={{ color: "#9370db" }}>
                  {qtdLancamentos > 0 ? `Média R$ ${formatCurrency(volumeTotal / qtdLancamentos)}` : "Sem registros"}
                </p>
              </div>
            </div>

            {/* Card 3: Maior Lançamento */}
            <div
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: maiorLancamento.valorNum > 0 ? "rgba(251,191,36,0.06)" : "#1e1e1e" }}
            >
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: maiorLancamento.valorNum > 0 ? "#fbbf24" : "#6b7280" }}>
                  Maior Lançamento
                </span>
                <div className="w-6 h-6 rounded-xl flex items-center justify-center" style={{ background: "rgba(251,191,36,0.15)" }}>
                  <svg className="w-3 h-3" fill="none" stroke="#fbbf24" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight" style={{ color: maiorLancamento.valorNum > 0 ? "#fbbf24" : "white" }}>
                  {maiorLancamento.valorNum > 0 ? `R$ ${formatCurrency(maiorLancamento.valorNum)}` : "—"}
                </p>
                <p className="text-[10px] mt-0.5 font-medium truncate" style={{ color: "#fbbf24" }} title={maiorLancamento.descricao}>
                  {maiorLancamento.descricao !== "-" ? maiorLancamento.descricao : "Sem lançamentos"}
                </p>
              </div>
            </div>
          </div>

          {/* Filtros + Tabela */}
          <div className="space-y-5 w-full">
            <LancamentosFilters
              startDate={startDate}
              endDate={endDate}
              conta={conta}
              contas={CONTAS}
              onStartDate={(v) => { setStartDate(v); setActivePreset(""); }}
              onEndDate={(v) => { setEndDate(v); setActivePreset(""); }}
              onConta={setConta}
              onClear={clearFilters}
              onApply={() => setPage(1)}
              activePreset={activePreset}
              onPreset={handlePreset}
            />

              <div
                className="rounded-3xl overflow-hidden"
                style={{ background: "#1e1e1e" }}
              >
                <div
                  className="px-5 py-4 flex justify-between items-center"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    background: "#1a1a1a",
                  }}
                >
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: "#6b7280" }}
                  >
                    Histórico de Movimentações
                  </span>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-xl"
                    style={{ background: "#4edea3", color: "#003824" }}
                  >
                    {totalFiltered} lançamentos
                  </span>
                </div>
                <LancamentosTable
                  rows={loading ? [] : pageRows}
                  page={safePage}
                  totalPages={totalPages}
                  total={totalFiltered}
                  pageSize={PAGE_SIZE}
                  onPage={setPage}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { LancamentosFilters } from "./components/LancamentosFilters";
import { LancamentosTable } from "./components/LancamentosTable";
import { BanknoteArrowUp } from "lucide-react";
import { lancamentosService, LancamentoBackend } from "./lancamentosService";

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

export default function LancamentosPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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

  let totalReceitas = 0;
  let totalDespesas = 0;

  filtered.forEach(l => {
    if (l.credito.startsWith("3")) totalReceitas += l.valorNum;
    if (l.debito.startsWith("4")) totalDespesas += l.valorNum;
  });

  const saldo = totalReceitas - totalDespesas;

  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function clearFilters() {
    setStartDate("");
    setEndDate("");
    setConta("all");
    setPage(1);
  }

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
          </header>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Receitas */}
            <div
              className="rounded-3xl p-5 flex flex-col justify-between gap-4"
              style={{ background: "#1e1e1e" }}
            >
              <div className="flex justify-between items-center">
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: "#6b7280" }}
                >
                  Total Receitas
                </span>
                <div
                  className="w-8 h-8 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(78,222,163,0.12)" }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="#4edea3"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">
                  R$ {formatCurrency(totalReceitas)}
                </p>
                <p
                  className="text-xs mt-1 font-medium"
                  style={{ color: "#4edea3" }}
                >
                  Contas do grupo 3
                </p>
              </div>
            </div>

            {/* Despesas */}
            <div
              className="rounded-3xl p-5 flex flex-col justify-between gap-4"
              style={{ background: "#1e1e1e" }}
            >
              <div className="flex justify-between items-center">
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: "#6b7280" }}
                >
                  Total Despesas
                </span>
                <div
                  className="w-8 h-8 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(255,100,100,0.1)" }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="#ff6464"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6L9 12.75l4.306-4.307a11.95 11.95 0 015.814 5.519l2.74 1.22m0 0l-5.94 2.28m5.94 2.28l-2.28 5.941"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">
                  R$ {formatCurrency(totalDespesas)}
                </p>
                <p
                  className="text-xs mt-1 font-medium"
                  style={{ color: "#ff6464" }}
                >
                  Contas do grupo 4
                </p>
              </div>
            </div>

            {/* Saldo */}
            <div
              className="rounded-3xl p-5 flex flex-col justify-between gap-4"
              style={{ background: saldo >= 0 ? "rgba(0,230,118,0.08)" : "rgba(239,68,68,0.08)" }}
            >
              <div className="flex justify-between items-center">
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: saldo >= 0 ? "#00E676" : "#ef4444" }}
                >
                  Balanço (Receitas - Despesas)
                </span>
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ 
                    color: saldo >= 0 ? "#00E676" : "#ef4444", 
                    background: saldo >= 0 ? "rgba(0,230,118,0.2)" : "rgba(239,68,68,0.2)" 
                  }}
                >
                  <BanknoteArrowUp />
                </div>
              </div>
              <div>
                <p
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: saldo >= 0 ? "#00E676" : "#ef4444" }}
                >
                  R$ {formatCurrency(saldo)}
                </p>
                <p
                  className="text-xs mt-1 font-medium"
                  style={{ color: saldo >= 0 ? "#00E676" : "#ef4444" }}
                >
                  {saldo >= 0 ? "Superávit do período" : "Déficit do período"}
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
                onStartDate={setStartDate}
                onEndDate={setEndDate}
                onConta={setConta}
                onClear={clearFilters}
                onApply={() => setPage(1)}
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
      </main>
    </div>
  );
}

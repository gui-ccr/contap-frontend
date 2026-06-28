"use client";

import { useState, useEffect } from "react";
import { contasReceberService, ContaReceberBackend } from "./contasReceberService";
import { Banknote } from "lucide-react";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ContasReceberPage() {
  const [contas, setContas] = useState<ContaReceberBackend[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [form, setForm] = useState({
    origem: "",
    valor: "",
    data_previsao: "",
  });

  const carregarContas = async () => {
    try {
      setLoading(true);
      const data = await contasReceberService.listarContasReceber();
      setContas(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarContas();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contasReceberService.criarContaReceber({
        origem: form.origem,
        valor: Number(form.valor),
        data_previsao: form.data_previsao,
      });
      alert("Conta a receber adicionada!");
      setForm({ origem: "", valor: "", data_previsao: "" });
      carregarContas();
    } catch (err: any) {
      alert("Erro: " + err.message);
    }
  };

  const handleBaixar = async (id: string) => {
    try {
      await contasReceberService.baixarConta(id);
      alert("Conta recebida e lançamento gerado!");
      carregarContas();
    } catch (err: any) {
      alert("Erro ao dar baixa: " + err.message);
    }
  };

  const inputStyle = {
    background: "#242424",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#e5e2e1",
  };
  const labelStyle = { color: "#6b7280" };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium" style={{ color: "#6b7280" }}>
                Gestão Financeira
              </p>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                Contas a Receber
              </h1>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-3xl p-5 flex flex-col justify-between gap-4 bg-[rgba(78,222,163,0.08)]">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[#4edea3] font-semibold uppercase tracking-widest">
                  Total a Receber (Pendente)
                </span>
                <div className="w-10 h-10 text-[#4edea3] bg-[#4edea3]/20 rounded-2xl flex items-center justify-center">
                  <Banknote size={20} />
                </div>
              </div>
              <div>
                <p className="text-2xl text-[#4edea3] font-bold tracking-tight">
                  R$ {formatCurrency(contas.filter(c => !c.recebido).reduce((acc, curr) => acc + curr.valor, 0))}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-6">
              <div className="rounded-3xl overflow-hidden" style={{ background: "#1e1e1e" }}>
                <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#1a1a1a" }}>
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
                    Nova Conta
                  </span>
                </div>
                <form onSubmit={handleSalvar} className="p-5 space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest" style={labelStyle}>Cliente / Origem</label>
                    <input type="text" name="origem" value={form.origem} onChange={handleInputChange} placeholder="Ex: Cliente João" className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest" style={labelStyle}>Valor (R$)</label>
                    <input type="number" step="0.01" name="valor" value={form.valor} onChange={handleInputChange} placeholder="0,00" className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest" style={labelStyle}>Data Prevista</label>
                    <input type="date" name="data_previsao" value={form.data_previsao} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} required />
                  </div>
                  <button type="submit" className="w-full py-2.5 px-4 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 mt-2" style={{ background: "#4edea3", color: "#003824" }}>
                    Salvar Registro
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-5">
              <div className="rounded-3xl overflow-hidden" style={{ background: "#1e1e1e" }}>
                <div className="px-5 py-4 flex justify-between items-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#1a1a1a" }}>
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>Títulos</span>
                </div>
                <div className="p-5 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="pb-3 text-xs font-medium text-gray-400">Origem</th>
                        <th className="pb-3 text-xs font-medium text-gray-400">Vencimento</th>
                        <th className="pb-3 text-xs font-medium text-gray-400 text-right">Valor</th>
                        <th className="pb-3 text-xs font-medium text-gray-400 text-center">Status</th>
                        <th className="pb-3 text-xs font-medium text-gray-400 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {loading ? (
                        <tr><td colSpan={5} className="py-4 text-center text-gray-500">Carregando...</td></tr>
                      ) : contas.length === 0 ? (
                        <tr><td colSpan={5} className="py-4 text-center text-gray-500">Nenhuma conta cadastrada</td></tr>
                      ) : (
                        contas.map(c => (
                          <tr key={c.id} className="border-t border-gray-800">
                            <td className="py-4 text-gray-200">{c.origem}</td>
                            <td className="py-4 text-gray-200">{new Date(c.data_previsao + "T12:00:00Z").toLocaleDateString("pt-BR")}</td>
                            <td className="py-4 text-right text-white font-medium">R$ {formatCurrency(c.valor)}</td>
                            <td className="py-4 text-center">
                              {c.recebido ? (
                                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-xs font-medium">Recebido</span>
                              ) : (
                                <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-xs font-medium">Pendente</span>
                              )}
                            </td>
                            <td className="py-4 text-right">
                              {!c.recebido && (
                                <button onClick={() => handleBaixar(c.id)} className="px-3 py-1 bg-[#4edea3] text-[#003824] rounded-lg text-xs font-semibold hover:opacity-80 transition cursor-pointer">
                                  Dar Baixa
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

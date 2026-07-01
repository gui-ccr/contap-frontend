"use client";

import { useState, useEffect, useRef } from "react";
import { contasReceberService, ContaReceberBackend } from "@/features/contas-receber/contasReceberService";
import { notasFiscaisService, NotaFiscal } from "./notasFiscaisService";
import { apiClient, getEmpresaIdFromToken } from "@/shared/api";
import { FileText, Upload, Trash2, ExternalLink, Paperclip, X } from "lucide-react";
import { UsuariosPagination } from "@/features/usuarios/components/UsuariosPagination";

interface ContaPagar {
  id: string;
  empresa_id: string;
  descricao: string;
  valor: number;
  data_vencimento: string;
  pago: boolean;
  data_pagamento: string | null;
}

async function listarContasPagar(): Promise<ContaPagar[]> {
  const empresa_id = getEmpresaIdFromToken();
  if (!empresa_id) throw new Error("Empresa não encontrada na sessão");
  return apiClient.get<ContaPagar[]>("/contas-pagar", { empresa_id });
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr + "T12:00:00Z").toLocaleDateString("pt-BR");
}

type Tab = "conta_receber" | "conta_pagar";

interface ModalState {
  open: boolean;
  tipo: "conta_receber" | "conta_pagar";
  referencia_id: string;
  descricao: string;
}

export default function NotasFiscaisPage() {
  const [tab, setTab] = useState<Tab>("conta_receber");
  const [contasReceber, setContasReceber] = useState<ContaReceberBackend[]>([]);
  const [contasPagar, setContasPagar] = useState<ContaPagar[]>([]);
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState<ModalState>({
    open: false,
    tipo: "conta_receber",
    referencia_id: "",
    descricao: "",
  });
  const [form, setForm] = useState({ numero_nota: "", emitida_em: "" });
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const getFirstDayOfMonth = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
  };
  const getLastDayOfMonth = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
  };

  const [dataInicio, setDataInicio] = useState(getFirstDayOfMonth);
  const [dataFim, setDataFim] = useState(getLastDayOfMonth);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => setPageSize(e.matches ? 8 : 4);
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const carregar = async () => {
    try {
      setLoading(true);
      const [cr, cp, nf] = await Promise.all([
        contasReceberService.listarContasReceber(),
        listarContasPagar(),
        notasFiscaisService.listar(),
      ]);
      setContasReceber(cr);
      setContasPagar(cp);
      setNotas(nf);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [isBaixaOp, setIsBaixaOp] = useState(false);

  useEffect(() => {
    carregar().then(() => {
      const search = new URLSearchParams(window.location.search);
      const darBaixaId = search.get("darBaixaId");
      const tipoBaixa = search.get("tipoBaixa") as Tab;
      const descBaixa = search.get("descBaixa");

      if (darBaixaId && tipoBaixa && descBaixa) {
        setTab(tipoBaixa);
        setModal({ open: true, tipo: tipoBaixa, referencia_id: darBaixaId, descricao: descBaixa });
        setIsBaixaOp(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    });
  }, []);

  const notasDaReferencia = (referencia_id: string) =>
    notas.filter((n) => n.referencia_id === referencia_id);

  const abrirModal = (tipo: Tab, id: string, desc: string) => {
    setIsBaixaOp(false);
    setModal({ open: true, tipo, referencia_id: id, descricao: desc });
    setForm({ numero_nota: "", emitida_em: "" });
    setArquivo(null);
  };

  const fecharModal = () => {
    setModal((m) => ({ ...m, open: false }));
    setIsBaixaOp(false);
  };

  const handleAnexar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arquivo) return alert("Selecione um arquivo.");
    try {
      setUploading(true);
      const url = await notasFiscaisService.uploadArquivo(arquivo);
      await notasFiscaisService.anexar({
        tipo_referencia: modal.tipo,
        referencia_id: modal.referencia_id,
        numero_nota: form.numero_nota || undefined,
        arquivo_url: url,
        arquivo_nome: arquivo.name,
        emitida_em: form.emitida_em || undefined,
      });

      if (isBaixaOp) {
        if (modal.tipo === "conta_pagar") {
          const { contasPagarService } = await import("@/features/contas-pagar/contasPagarService");
          await contasPagarService.baixarConta(modal.referencia_id);
        } else if (modal.tipo === "conta_receber") {
          await contasReceberService.baixarConta(modal.referencia_id);
        }
        alert("Conta baixada com sucesso e nota fiscal anexada!");
      }

      fecharModal();
      await carregar();
    } catch (err: any) {
      alert("Erro: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletar = async (id: string) => {
    if (!confirm("Remover esta nota fiscal?")) return;
    try {
      await notasFiscaisService.deletar(id);
      await carregar();
    } catch (err: any) {
      alert("Erro: " + err.message);
    }
  };

  const cardStyle = { background: "#1e1e1e" };
  const headerStyle = { borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#1a1a1a" };
  const inputStyle = { background: "#242424", border: "1px solid rgba(255,255,255,0.06)", color: "#e5e2e1" };
  const labelStyle = { color: "#6b7280" };

  const contasReceberFiltradas = contasReceber.filter(c => {
    if (dataInicio && c.data_previsao < dataInicio) return false;
    if (dataFim && c.data_previsao > dataFim) return false;
    return true;
  });

  const contasPagarFiltradas = contasPagar.filter(c => {
    if (dataInicio && c.data_vencimento < dataInicio) return false;
    if (dataFim && c.data_vencimento > dataFim) return false;
    return true;
  });

  const listAtual = tab === "conta_receber" ? contasReceberFiltradas : contasPagarFiltradas;
  const totalPages = Math.max(1, Math.ceil(listAtual.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = listAtual.slice((safePage - 1) * pageSize, safePage * pageSize);

  const totalSemNF =
    tab === "conta_receber"
      ? contasReceberFiltradas.filter((c) => notasDaReferencia(c.id).length === 0).length
      : contasPagarFiltradas.filter((c) => notasDaReferencia(c.id!).length === 0).length;

  const NfChips = ({ referencia_id }: { referencia_id: string }) => {
    const nfs = notasDaReferencia(referencia_id);
    if (nfs.length === 0) return <span className="text-gray-600 text-xs">Nenhuma</span>;
    return (
      <div className="flex flex-wrap gap-2">
        {nfs.map((nf) => (
          <div
            key={nf.id}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs"
            style={{ background: "rgba(78,222,163,0.08)", color: "#4edea3" }}
          >
            <Paperclip size={11} />
            <span className="max-w-[100px] truncate" title={nf.arquivo_nome}>
              {nf.numero_nota ? `NF-${nf.numero_nota}` : nf.arquivo_nome}
            </span>
            <a href={nf.arquivo_url} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100" title="Abrir">
              <ExternalLink size={11} />
            </a>
            <button onClick={() => handleDeletar(nf.id)} className="opacity-40 hover:opacity-100 hover:text-red-400 transition" title="Remover">
              <Trash2 size={11} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-7xl mx-auto space-y-6">

          <header>
            <p className="text-xs font-medium" style={{ color: "#6b7280" }}>Gestão Financeira</p>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">Notas Fiscais</h1>
          </header>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-3xl p-5" style={{ background: "rgba(78,222,163,0.08)" }}>
              <span className="text-[10px] text-[#4edea3] font-semibold uppercase tracking-widest">Total de Notas</span>
              <p className="text-2xl text-[#4edea3] font-bold mt-2">{notas.length}</p>
            </div>
            <div className="rounded-3xl p-5" style={{ background: "rgba(255,255,255,0.04)" }}>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Contas a Receber</span>
              <p className="text-2xl text-white font-bold mt-2">{contasReceber.length}</p>
            </div>
            <div className="rounded-3xl p-5" style={{ background: "rgba(255,255,255,0.04)" }}>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Contas a Pagar</span>
              <p className="text-2xl text-white font-bold mt-2">{contasPagar.length}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {(["conta_receber", "conta_pagar"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setPage(1); }}
                className="px-4 py-2 rounded-2xl text-xs font-semibold transition"
                style={
                  tab === t
                    ? { background: "#4edea3", color: "#003824" }
                    : { background: "#1e1e1e", color: "#6b7280" }
                }
              >
                {t === "conta_receber" ? "Contas a Receber" : "Contas a Pagar"}
              </button>
            ))}
          </div>

          {/* Filters Panel */}
          <div className="bg-[#1a1a1a] p-4 rounded-2xl flex flex-col sm:flex-row flex-wrap gap-4 items-end border border-white/5">
            <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Data Inicial</label>
              <input type="date" value={dataInicio} onChange={e => { setDataInicio(e.target.value); setPage(1); }} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all border focus:border-[#4edea3]/50" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Data Final</label>
              <input type="date" value={dataFim} onChange={e => { setDataFim(e.target.value); setPage(1); }} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all border focus:border-[#4edea3]/50" style={inputStyle} />
            </div>
            
            {(dataInicio || dataFim) && (
              <button
                onClick={() => { setDataInicio(""); setDataFim(""); setPage(1); }}
                className="px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer h-[42px] flex items-center gap-2"
              >
                <X size={14} /> Limpar
              </button>
            )}
          </div>

          {/* Tabela */}
          <div className="rounded-3xl overflow-hidden" style={cardStyle}>
            <div className="px-5 py-4 flex items-center gap-2" style={headerStyle}>
              <FileText size={14} style={{ color: "#6b7280" }} />
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
                {tab === "conta_receber" ? "Contas a Receber" : "Contas a Pagar"} — Notas Fiscais
              </span>
              {totalSemNF > 0 && (
                <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400">
                  {totalSemNF} sem NF
                </span>
              )}
            </div>

            <div className="p-5 overflow-x-auto">
              {loading ? (
                <p className="text-center text-gray-500 py-8">Carregando...</p>
              ) : tab === "conta_receber" ? (
                listAtual.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Nenhuma conta a receber encontrada com estes filtros.</p>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="pb-3 text-xs font-medium text-gray-400">Origem</th>
                        <th className="pb-3 text-xs font-medium text-gray-400">Vencimento</th>
                        <th className="pb-3 text-xs font-medium text-gray-400 text-right">Valor</th>
                        <th className="pb-3 text-xs font-medium text-gray-400 text-center">Status</th>
                        <th className="pb-3 text-xs font-medium text-gray-400">Notas Fiscais</th>
                        <th className="pb-3 text-xs font-medium text-gray-400 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {(paginated as ContaReceberBackend[]).map((c) => (
                        <tr key={c.id} className="border-t border-gray-800">
                          <td className="py-4 text-gray-200">{c.origem}</td>
                          <td className="py-4 text-gray-200">{formatDate(c.data_previsao)}</td>
                          <td className="py-4 text-right text-white font-medium">R$ {formatCurrency(c.valor)}</td>
                          <td className="py-4 text-center">
                            {c.recebido
                              ? <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-xs font-medium">Recebido</span>
                              : <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-xs font-medium">Pendente</span>}
                          </td>
                          <td className="py-4"><NfChips referencia_id={c.id} /></td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => abrirModal("conta_receber", c.id, c.origem)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition hover:opacity-80 ml-auto"
                              style={{ background: "#242424", color: "#4edea3", border: "1px solid rgba(78,222,163,0.2)" }}
                            >
                              <Upload size={12} /> Anexar NF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              ) : (
                listAtual.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Nenhuma conta a pagar encontrada com estes filtros.</p>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="pb-3 text-xs font-medium text-gray-400">Descrição</th>
                        <th className="pb-3 text-xs font-medium text-gray-400">Vencimento</th>
                        <th className="pb-3 text-xs font-medium text-gray-400 text-right">Valor</th>
                        <th className="pb-3 text-xs font-medium text-gray-400 text-center">Status</th>
                        <th className="pb-3 text-xs font-medium text-gray-400">Notas Fiscais</th>
                        <th className="pb-3 text-xs font-medium text-gray-400 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {(paginated as ContaPagar[]).map((c) => (
                        <tr key={c.id} className="border-t border-gray-800">
                          <td className="py-4 text-gray-200">{c.descricao}</td>
                          <td className="py-4 text-gray-200">{formatDate(c.data_vencimento)}</td>
                          <td className="py-4 text-right text-white font-medium">R$ {formatCurrency(c.valor)}</td>
                          <td className="py-4 text-center">
                            {c.pago
                              ? <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-xs font-medium">Pago</span>
                              : <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs font-medium">Em Aberto</span>}
                          </td>
                          <td className="py-4"><NfChips referencia_id={c.id!} /></td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => abrirModal("conta_pagar", c.id!, c.descricao)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition hover:opacity-80 ml-auto"
                              style={{ background: "#242424", color: "#4edea3", border: "1px solid rgba(78,222,163,0.2)" }}
                            >
                              <Upload size={12} /> Anexar NF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}
            </div>
          </div>
          
          {!loading && listAtual.length > 0 && (
            <UsuariosPagination
              page={safePage}
              totalPages={totalPages}
              total={listAtual.length}
              pageSize={pageSize}
              onPage={setPage}
            />
          )}
        </div>
      </main>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-[576px] rounded-3xl overflow-hidden" style={cardStyle}>
            <div className="px-5 py-4 flex items-center justify-between" style={headerStyle}>
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
                Anexar Nota Fiscal
              </span>
              <button onClick={fecharModal} className="text-gray-500 hover:text-gray-300 text-lg leading-none">✕</button>
            </div>

            <form onSubmit={handleAnexar} className="p-5 space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Referência</p>
                <p className="text-sm text-white font-medium">{modal.descricao}</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-widest" style={labelStyle}>
                  Número da Nota (opcional)
                </label>
                <input
                  type="text"
                  value={form.numero_nota}
                  onChange={(e) => setForm((f) => ({ ...f, numero_nota: e.target.value }))}
                  placeholder="Ex: 000123"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-widest" style={labelStyle}>
                  Data de Emissão (opcional)
                </label>
                <input
                  type="date"
                  value={form.emitida_em}
                  onChange={(e) => setForm((f) => ({ ...f, emitida_em: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-widest" style={labelStyle}>
                  Arquivo *
                </label>
                <div
                  className="w-full px-3 py-5 rounded-xl border-dashed border-2 flex flex-col items-center gap-2 cursor-pointer transition"
                  style={{
                    borderColor: arquivo ? "rgba(78,222,163,0.4)" : "rgba(255,255,255,0.1)",
                    background: "#242424",
                  }}
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload size={20} style={{ color: arquivo ? "#4edea3" : "#6b7280" }} />
                  {arquivo ? (
                    <span className="text-xs text-[#4edea3] text-center break-all px-2">{arquivo.name}</span>
                  ) : (
                    <span className="text-xs text-gray-500 text-center">Clique para selecionar<br />(PDF, XML, PNG, JPG)</span>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.xml,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="flex-1 py-2.5 rounded-2xl text-sm font-semibold"
                  style={{ background: "#242424", color: "#6b7280" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading || !arquivo}
                  className="flex-1 py-2.5 rounded-2xl text-sm font-semibold transition hover:opacity-90 disabled:opacity-40"
                  style={{ background: "#4edea3", color: "#003824" }}
                >
                  {uploading ? "Enviando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

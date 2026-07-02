'use client';

import React, { useState } from 'react';
import { X, Calendar, FileText, Tag, DollarSign, ListFilter, CreditCard, Banknote, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import ModalConfirmacao from './ModalConfirmacao';
import { lancamentosService } from '../lancamentosService';
import { getEmpresaIdFromToken } from '@/shared/api';

interface NovoLancamentoFormProps {
  onLancamentoCriado?: () => void;
}

export default function NovoLancamentoForm({ onLancamentoCriado }: NovoLancamentoFormProps) {
  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    tipo: 'receita',
    data: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  function formatCurrency(value: string | number) {
    const numeric = typeof value === "string" ? Number(value.replace(/\D/g, "")) / 100 : value;
    if (isNaN(numeric) || numeric === 0) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(numeric);
  }

  function parseCurrency(value: string) {
    return (Number(value.replace(/\D/g, "")) / 100).toString();
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "valor") {
      setForm(prev => ({ ...prev, [name]: parseCurrency(value) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAvancar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.descricao || !form.valor || !form.data) return;
    setIsModalOpen(true);
  };

  const handleSalvarFinal = async () => {
    try {
      const empresaId = getEmpresaIdFromToken();
      if (!empresaId) {
        toast.error("Erro: Sessão inválida ou empresa não encontrada.");
        return;
      }
      
      await lancamentosService.criarLancamentoSimplificado({
        empresa_id: empresaId,
        descricao: form.descricao,
        valor: Number(form.valor),
        tipoTransacao: form.tipo === 'receita' ? "CREDITO" : "DEBITO",
        data_lancamento: form.data,
      });

      toast.success('Lançamento realizado com sucesso!');
      setForm({ descricao: '', valor: '', tipo: 'receita', data: '' });
      setIsModalOpen(false);
      
      if (onLancamentoCriado) {
        onLancamentoCriado();
      }
    } catch (err: any) {
      alert("Erro ao criar lançamento: " + err.message);
    }
  };

  const inputStyle = {
    background: "#242424",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#e5e2e1",
  };

  const labelStyle = {
    color: "#6b7280",
  };

  return (
    <>
      <div className="rounded-3xl overflow-hidden" style={{ background: "#1e1e1e" }}>
        {/* Cabeçalho */}
        <div
          className="px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#1a1a1a" }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
            Novo Registro
          </span>
          <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
            Insira os dados do lançamento abaixo
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleAvancar} className="p-5 space-y-4">

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-widest" style={labelStyle}>
              Descrição
            </label>
            <input
              type="text"
              name="descricao"
              value={form.descricao}
              onChange={handleInputChange}
              placeholder="Ex: Pagamento de Fornecedor, Entrada de Pix..."
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={inputStyle}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-widest" style={labelStyle}>
                Valor (R$)
              </label>
              <input
                type="text"
                name="valor"
                value={formatCurrency(form.valor) || ""}
                onChange={handleInputChange}
                placeholder="R$ 0,00"
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-widest" style={labelStyle}>
                Tipo
              </label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none appearance-none"
                style={inputStyle}
              >
                <option value="receita">Receita (Entrada)</option>
                <option value="despesa">Despesa (Saída)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-widest" style={labelStyle}>
              Data do Lançamento
            </label>
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={inputStyle}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 mt-2 cursor-pointer"
            style={{ background: "#4edea3", color: "#003824" }}
          >
            Avançar para Confirmação →
          </button>
        </form>
      </div>

      <ModalConfirmacao
        isOpen={isModalOpen}
        dados={form}
        onFechar={() => setIsModalOpen(false)}
        onConfirmar={handleSalvarFinal}
      />
    </>
  );
}
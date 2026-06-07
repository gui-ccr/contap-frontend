'use client';

import React, { useState } from 'react';
import ModalConfirmacao from './ModalConfirmacao';

export default function NovoLancamentoForm() {
  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    tipo: 'receita',
    data: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAvancar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.descricao || !form.valor || !form.data) return;
    setIsModalOpen(true);
  };

  const handleSalvarFinal = () => {
    console.log("SALVANDO NOVO LANÇAMENTO:", form);
    alert('Lançamento realizado com sucesso!');
    setForm({ descricao: '', valor: '', tipo: 'receita', data: '' });
    setIsModalOpen(false);
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
                type="number"
                name="valor"
                step="0.01"
                value={form.valor}
                onChange={handleInputChange}
                placeholder="0,00"
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
            className="w-full py-2.5 px-4 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 mt-2"
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
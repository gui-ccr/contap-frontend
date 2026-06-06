'use client';

import React, { useState } from 'react';
import ModalConfirmacao from './ModalConfirmacao';

export default function NovoLancamentoForm() {
  // Estado para guardar os dados digitados no formulário
  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    tipo: 'receita',
    data: ''
  });

  // Estado para controlar se o modal de confirmação está aberto ou fechado
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função que atualiza os dados do formulário dinamicamente conforme o usuário digita
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Função disparada ao clicar no botão de enviar o formulário
  const handleAvancar = (e: React.FormEvent) => {
    e.preventDefault();
    // Só avança se os campos principais estiverem preenchidos
    if (!form.descricao || !form.valor || !form.data) return;
    
    // Abre o modal de confirmação
    setIsModalOpen(true);
  };

  // Função disparada quando o usuário clica em "Confirmar e Salvar" dentro do modal
  const handleSalvarFinal = () => {
    console.log("SALVANDO NOVO LANÇAMENTO DO ZERO:", form);
    
    alert('Lançamento realizado com sucesso!');
    
    // Reseta o formulário limpando todos os campos
    setForm({ descricao: '', valor: '', tipo: 'receita', data: '' });
    // Fecha o modal
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Cabeçalho do Formulário Remodelado */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 p-6 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">💰 Novo Lançamento Financeiro</h2>
        <p className="text-xs text-indigo-100 mt-1">Insira os dados abaixo para registrar a movimentação</p>
      </div>

      {/* Formulário Principal */}
      <form onSubmit={handleAvancar} className="p-6 space-y-5">
        
        {/* Campo: Descrição */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Descrição</label>
          <input 
            type="text" 
            name="descricao"
            value={form.descricao}
            onChange={handleInputChange}
            placeholder="Ex: Pagamento de Fornecedor, Entrada de Pix..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-slate-800"
            required
          />
        </div>

        {/* Linha com dois campos: Valor e Tipo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Campo: Valor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Valor (R$)</label>
            <input 
              type="number" 
              name="valor"
              step="0.01"
              value={form.valor}
              onChange={handleInputChange}
              placeholder="0,00"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-slate-800"
              required
            />
          </div>

          {/* Campo: Tipo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tipo de Conta</label>
            <select 
              name="tipo"
              value={form.tipo}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-slate-800"
            >
              <option value="receita">🟢 Receita (Entrada)</option>
              <option value="despesa">🔴 Despesa (Saída)</option>
            </select>
          </div>
        </div>

        {/* Campo: Data */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Data do Lançamento</label>
          <input 
            type="date" 
            name="data"
            value={form.data}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-slate-800"
            required
          />
        </div>

        {/* Botão de Envio */}
        <button 
          type="submit" 
          className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-sm text-sm transition-colors flex items-center justify-center gap-1"
        >
          Avançar para Confirmação →
        </button>
      </form>

      {/* Modal acoplado passando as funções de fechar e salvar */}
      <ModalConfirmacao 
        isOpen={isModalOpen}
        dados={form}
        onFechar={() => setIsModalOpen(false)}
        onConfirmar={handleSalvarFinal}
      />
    </div>
  );
}
'use client';

import React from 'react';

// Definindo o que o modal precisa receber para funcionar
interface ModalProps {
  isOpen: boolean;
  dados: {
    descricao: string;
    valor: string;
    tipo: string;
    data: string;
  };
  onFechar: () => void;
  onConfirmar: () => void;
}

export default function ModalConfirmacao({ isOpen, dados, onFechar, onConfirmar }: ModalProps) {
  // Se o modal não estiver aberto, ele não renderiza nada na tela
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Topo do Modal */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            🔍 Confirmar Dados do Lançamento
          </h3>
        </div>
        
        {/* Corpo com o resumo dos dados */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm font-medium text-slate-500">Descrição:</span>
            <strong className="text-slate-800">{dados.descricao}</strong>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm font-medium text-slate-500">Valor:</span>
            <strong className={`text-base ${dados.tipo === 'receita' ? 'text-emerald-600' : 'text-rose-600'}`}>
              R$ {parseFloat(dados.valor || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </strong>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm font-medium text-slate-500">Tipo:</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              dados.tipo === 'receita' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}>
              {dados.tipo === 'receita' ? '🟢 Receita (Entrada)' : '🔴 Despesa (Saída)'}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium text-slate-500">Data:</span>
            <strong className="text-slate-800">{dados.data.split('-').reverse().join('/')}</strong>
          </div>
        </div>

        {/* Botões do Modal */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onFechar} 
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors"
          >
            Voltar e Corrigir
          </button>
          <button 
            type="button"
            onClick={onConfirmar} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-colors"
          >
            Confirmar e Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
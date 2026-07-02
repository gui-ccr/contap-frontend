'use client';

import React from 'react';

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
  if (!isOpen) return null;

  const isReceita = dados.tipo === 'receita';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div 
        className="rounded-3xl overflow-hidden shadow-2xl shrink-0" 
        style={{ background: "#1e1e1e", width: "100%", maxWidth: "400px", minWidth: "300px" }}
      >

        {/* Topo */}
        <div
          className="px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#1a1a1a" }}
        >
          <h3 className="text-sm font-semibold text-white">Confirmar Lançamento</h3>
          <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>Verifique os dados antes de salvar</p>
        </div>

        {/* Corpo */}
        <div className="px-6 py-5 space-y-3">
          {[
            { label: "Descrição", value: dados.descricao },
            {
              label: "Valor",
              value: (
                <span style={{ color: isReceita ? "#4edea3" : "#ff6464" }} className="font-semibold">
                  R$ {parseFloat(dados.valor || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              ),
            },
            {
              label: "Tipo",
              value: (
                <span
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold"
                  style={isReceita
                    ? { background: "rgba(78,222,163,0.12)", color: "#4edea3" }
                    : { background: "rgba(255,100,100,0.1)", color: "#ff6464" }}
                >
                  {isReceita ? "Receita (Entrada)" : "Despesa (Saída)"}
                </span>
              ),
            },
            { label: "Data", value: dados.data ? dados.data.split('-').reverse().join('/') : "—" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between py-2.5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              <span className="text-xs font-medium" style={{ color: "#6b7280" }}>{label}</span>
              <span className="text-sm font-medium text-white">{value}</span>
            </div>
          ))}
        </div>

        {/* Botões */}
        <div
          className="px-6 py-4 flex justify-end gap-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            type="button"
            onClick={onFechar}
            className="px-4 py-2 rounded-2xl text-sm font-medium transition-all hover:bg-white/5"
            style={{ color: "#6b7280", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Voltar e Corrigir
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="px-4 py-2 rounded-2xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "#4edea3", color: "#003824" }}
          >
            Confirmar e Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
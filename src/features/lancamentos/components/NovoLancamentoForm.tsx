'use client';

import React, { useState } from 'react';
import { toast } from "sonner";
import ModalConfirmacao from './ModalConfirmacao';
import { lancamentosService } from '../lancamentosService';
import { getEmpresaIdFromToken } from '@/shared/api';
import { Field, Input, Select, Button } from '@/ui/forms';
import { formatCurrencyInput, parseCurrency } from '@/utils/format';
import { DatePicker } from "@/ui/aria/application/date-picker/date-picker";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "react-aria-components";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "valor") {
      setForm(prev => ({ ...prev, [name]: parseCurrency(value).toString() }));
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
        toast.error("Sessão inválida ou empresa não encontrada. Faça login novamente.");
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

      onLancamentoCriado?.();
    } catch (err: any) {
      toast.error("Erro ao criar lançamento: " + err.message);
    }
  };

  return (
    <>
      <div className="rounded-3xl overflow-hidden bg-surface-container border border-outline-variant/30 rim-light">
        <div className="px-5 py-4 border-b border-outline-variant/30 bg-surface-container-low">
          <span className="text-label-sm uppercase tracking-widest text-primary">
            Novo registro
          </span>
          <p className="text-body-sm text-on-surface-variant/70 mt-0.5">
            Insira os dados do lançamento abaixo
          </p>
        </div>

        <form onSubmit={handleAvancar} className="p-5 space-y-4">
          <Field label="Descrição" required>
            <Input
              type="text"
              name="descricao"
              value={form.descricao}
              onChange={handleInputChange}
              placeholder="Ex: Pagamento de fornecedor, entrada de Pix..."
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Valor" required>
              <Input
                type="text"
                name="valor"
                inputMode="numeric"
                value={!form.valor || Number(form.valor) === 0 ? "" : formatCurrencyInput(Number(form.valor))}
                onChange={handleInputChange}
                placeholder="R$ 0,00"
                required
              />
            </Field>

            <Field label="Tipo">
              <Select name="tipo" value={form.tipo} onChange={handleInputChange}>
                <option value="receita">Receita (entrada)</option>
                <option value="despesa">Despesa (saída)</option>
              </Select>
            </Field>
          </div>

          <Field label="Data do lançamento" required>
            <DatePicker
              value={form.data ? parseDate(form.data) : null}
              onChange={(v: DateValue | null) => setForm(prev => ({ ...prev, data: v ? v.toString() : "" }))}
            />
          </Field>

          <Button type="submit" className="w-full mt-2">
            Avançar para confirmação
          </Button>
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

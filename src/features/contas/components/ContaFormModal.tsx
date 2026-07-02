"use client";

import { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalFooter } from "@/ui/Modal";
import { Field, Input, Select, Button } from "@/ui/forms";
import { formatCurrencyInput, parseCurrency } from "@/utils/format";
import type { ContaFinanceira, ContaFinanceiraPayload } from "../types";
import type { ContaContabil } from "@/features/plano-contas/planoContasService";

interface ContaFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: ContaFinanceiraPayload) => Promise<void>;
  editing: ContaFinanceira | null;
  planoContas: ContaContabil[];
  titulo: string;
  eyebrow: string;
  campoTituloLabel: string;
  campoDataLabel: string;
  campoTipoLabel: string;
}

export function ContaFormModal({
  open, onClose, onSubmit, editing, planoContas,
  titulo, eyebrow, campoTituloLabel, campoDataLabel, campoTipoLabel,
}: ContaFormModalProps) {
  const [form, setForm] = useState({ titulo: "", valor: "", tipo: "", dataAlvo: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      editing
        ? { titulo: editing.titulo, valor: editing.valor.toString(), tipo: editing.tipo, dataAlvo: editing.dataAlvo }
        : { titulo: "", valor: "", tipo: planoContas[0]?.id ?? "", dataAlvo: "" }
    );
  }, [open, editing, planoContas]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        titulo: form.titulo,
        valor: Number(form.valor),
        tipo: form.tipo,
        dataAlvo: form.dataAlvo,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} maxWidth="576px">
      <ModalHeader eyebrow={eyebrow} title={titulo} onClose={onClose} />

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <Field label={campoTituloLabel} required>
          <Input
            type="text"
            value={form.titulo}
            onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
            placeholder="Ex: Aluguel, Fornecedor XYZ..."
            required
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Valor" required>
            <Input
              type="text"
              inputMode="numeric"
              value={form.valor === "" ? "" : formatCurrencyInput(Number(form.valor))}
              onChange={(e) => setForm((p) => ({ ...p, valor: parseCurrency(e.target.value).toString() }))}
              placeholder="R$ 0,00"
              required
            />
          </Field>
          <Field label={campoTipoLabel} required>
            <Select
              value={form.tipo}
              onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))}
              required
            >
              {planoContas.map((pc) => (
                <option key={pc.id} value={pc.id}>{pc.codigo} - {pc.nome}</option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label={campoDataLabel} required>
          <Input
            type="date"
            value={form.dataAlvo}
            onChange={(e) => setForm((p) => ({ ...p, dataAlvo: e.target.value }))}
            required
          />
        </Field>

        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar conta"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

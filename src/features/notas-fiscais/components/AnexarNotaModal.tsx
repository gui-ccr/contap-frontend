"use client";

import { useRef, useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { Modal, ModalHeader, ModalFooter } from "@/ui/Modal";
import { Field, Input, Button } from "@/ui/forms";
import { DatePicker } from "@/ui/application/date-picker/date-picker";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "react-aria-components";

export interface AnexarNotaFormData {
  numero_nota: string;
  emitida_em: string;
  arquivo: File;
  novo_valor?: number;
}

interface AnexarNotaModalProps {
  open: boolean;
  descricao: string;
  liquidado: boolean;
  valorOriginal: number;
  statusPendente: string;
  onClose: () => void;
  onSubmit: (data: AnexarNotaFormData) => Promise<void>;
}

export function AnexarNotaModal({ open, descricao, liquidado, valorOriginal, statusPendente, onClose, onSubmit }: AnexarNotaModalProps) {
  const [numeroNota, setNumeroNota] = useState("");
  const [novoValor, setNovoValor] = useState<string>("");
  
  const getHoje = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  };

  const [emitidaEm, setEmitidaEm] = useState(getHoje());
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [arquivoErro, setArquivoErro] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setNumeroNota("");
      setEmitidaEm(getHoje());
      setArquivo(null);
      setArquivoErro(null);
      setNovoValor("");
    }
  }, [open]);

  const jurosCalculados = (Number(novoValor) || valorOriginal) - valorOriginal;
  const jurosPorcentagem = valorOriginal > 0 ? ((jurosCalculados / valorOriginal) * 100).toFixed(1) : "0.0";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setArquivoErro("O arquivo excede o limite de 5MB.");
        setArquivo(null);
      } else {
        setArquivoErro(null);
        setArquivo(file);
      }
    } else {
      setArquivo(null);
      setArquivoErro(null);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!arquivo || !numeroNota || !emitidaEm) return;
    try {
      setUploading(true);
      await onSubmit({ 
        numero_nota: numeroNota, 
        emitida_em: emitidaEm, 
        arquivo,
        novo_valor: novoValor && !isNaN(Number(novoValor)) ? Number(novoValor) : undefined
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} maxWidth="576px">
      <ModalHeader
        eyebrow="Notas Fiscais"
        title="Anexar nota fiscal"
        subtitle={`Referência: ${descricao}`}
        onClose={onClose}
      />

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Número da nota" required>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-on-surface-variant/50 pointer-events-none font-medium select-none">NF-</span>
              <Input
                type="text"
                required
                className="pl-[2.8rem]"
                value={numeroNota}
                onChange={(e) => setNumeroNota(e.target.value.replace(/\D/g, ''))}
                placeholder="000123"
              />
            </div>
          </Field>
          <Field label="Data de emissão" required>
            <DatePicker
              value={emitidaEm ? parseDate(emitidaEm) : null}
              onChange={(v: DateValue | null) => setEmitidaEm(v ? v.toString() : "")}
            />
          </Field>
        </div>

        {statusPendente === "Vencido" && !liquidado && (
          <div className="bg-error/5 p-4 rounded-xl border border-error/20 space-y-3">
            <h4 className="text-label-sm font-semibold text-error uppercase tracking-widest">Conta Vencida</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Novo Valor Pago (Opcional)" hint="Se houver juros, informe o valor total pago">
                <Input
                  type="number"
                  step="0.01"
                  min={valorOriginal}
                  value={novoValor}
                  onChange={(e) => setNovoValor(e.target.value)}
                  placeholder={`Mínimo: R$ ${valorOriginal.toFixed(2)}`}
                />
              </Field>
              <div className="flex flex-col justify-center pt-2 sm:pt-6">
                <span className="text-body-sm text-on-surface-variant">Juros / Acréscimos:</span>
                <span className={`text-lg font-bold tabular-nums ${jurosCalculados > 0 ? "text-error" : "text-on-surface"}`}>
                  R$ {jurosCalculados.toFixed(2)} {jurosCalculados > 0 && <span className="text-sm font-medium text-error/80 ml-1">({jurosPorcentagem}%)</span>}
                </span>
              </div>
            </div>
          </div>
        )}

        <Field label="Arquivo" required hint="PDF, XML, PNG ou JPG (Máx: 5MB)" error={arquivoErro ?? undefined}>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={`w-full px-3 py-6 rounded-xl border-2 border-dashed flex flex-col items-center gap-2 cursor-pointer transition-all bg-surface-container-low ${
              arquivo ? "border-primary/50" : "border-outline-variant/40 hover:border-outline-variant"
            }`}
          >
            <Upload size={20} className={arquivo ? "text-primary" : "text-on-surface-variant/60"} />
            {arquivo ? (
              <span className="text-body-sm text-primary text-center break-all px-2">{arquivo.name}</span>
            ) : (
              <span className="text-body-sm text-on-surface-variant/60 text-center">
                Clique para selecionar o arquivo
              </span>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.xml,.png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
        </Field>

        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={uploading || !arquivo || !numeroNota || !emitidaEm}>
            {uploading ? "Enviando..." : (liquidado ? "Anexar nota" : "Anexar e dar baixa")}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

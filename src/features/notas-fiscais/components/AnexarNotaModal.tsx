"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Modal, ModalHeader, ModalFooter } from "@/ui/Modal";
import { Field, Input, Button } from "@/ui/forms";

export interface AnexarNotaFormData {
  numero_nota: string;
  emitida_em: string;
  arquivo: File;
}

interface AnexarNotaModalProps {
  open: boolean;
  descricao: string;
  onClose: () => void;
  onSubmit: (data: AnexarNotaFormData) => Promise<void>;
}

export function AnexarNotaModal({ open, descricao, onClose, onSubmit }: AnexarNotaModalProps) {
  const [numeroNota, setNumeroNota] = useState("");
  const [emitidaEm, setEmitidaEm] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!arquivo) return;
    try {
      setUploading(true);
      await onSubmit({ numero_nota: numeroNota, emitida_em: emitidaEm, arquivo });
      setNumeroNota("");
      setEmitidaEm("");
      setArquivo(null);
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
          <Field label="Número da nota" hint="Opcional">
            <Input
              type="text"
              value={numeroNota}
              onChange={(e) => setNumeroNota(e.target.value)}
              placeholder="Ex: 000123"
            />
          </Field>
          <Field label="Data de emissão" hint="Opcional">
            <Input
              type="date"
              value={emitidaEm}
              onChange={(e) => setEmitidaEm(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Arquivo" required hint="PDF, XML, PNG ou JPG">
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
            onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
          />
        </Field>

        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={uploading || !arquivo}>
            {uploading ? "Enviando..." : "Anexar e dar baixa"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

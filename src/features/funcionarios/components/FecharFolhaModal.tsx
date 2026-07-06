"use client";

import { useState } from "react";
import { Modal, ModalHeader, ModalFooter } from "@/ui/modals/Modal";
import { Field, Select, Button, FormAlert } from "@/ui/forms";
import { apiClient } from "@/shared/api";
import { FileText } from "lucide-react";

interface FecharFolhaModalProps {
  onClose: () => void;
  onSuccess: (message: string, mesFechado: number, anoFechado: number) => void;
}

export function FecharFolhaModal({ onClose, onSuccess }: FecharFolhaModalProps) {
  const dataAtual = new Date();
  const [mes, setMes] = useState(dataAtual.getMonth() + 1); // 1-12
  const [ano, setAno] = useState(dataAtual.getFullYear());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      
      const res: any = await apiClient.post("/funcionarios/folha/fechar", { mes, ano });
      if (res.success || res.status === "success" || res.data?.status === "success") {
        onSuccess(res.message || res.data?.message || "Folha fechada com sucesso!", mes, ano);
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Não foi possível fechar a folha.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose} maxWidth="500px">
      <ModalHeader
        eyebrow="Folha de Pagamento"
        title="Fechar Folha do Mês"
        subtitle="Gerar holerites e contas a pagar (Salário, INSS, FGTS)."
        onClose={onClose}
      />

      <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Mês de Referência" required>
            <Select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
              {meses.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </Select>
          </Field>
          
          <Field label="Ano" required>
            <Select value={ano} onChange={(e) => setAno(Number(e.target.value))}>
              {[ano - 1, ano, ano + 1].map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-300 mt-2">
          <p className="mb-2"><strong>O que vai acontecer?</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Calculo progressivo de <strong>INSS e IRRF</strong>.</li>
            <li>Geração da conta a pagar de <strong>Salário Líquido</strong> (vencimento no 5º dia útil do mês seguinte).</li>
            <li>Geração da guia do <strong>Governo (INSS)</strong> para o dia 20.</li>
            <li>Geração da guia do <strong>Governo (FGTS)</strong> para o dia 7.</li>
          </ul>
        </div>

        {error && <FormAlert>{error}</FormAlert>}

        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            <FileText size={14} strokeWidth={2.5} />
            {saving ? "Calculando Folha..." : "Rodar Fechamento"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

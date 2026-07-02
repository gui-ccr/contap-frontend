"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { cargosService, type CargoBackend } from "@/features/cargos/cargosService";
import { Modal, ModalHeader, ModalFooter } from "@/ui/Modal";
import { Field, Input, Select, Button, FormAlert } from "@/ui/forms";
import { AvatarPicker } from "@/ui/forms/AvatarPicker";
import { formatCpfCnpj, formatCurrencyInput, parseCurrency } from "@/utils/format";

export interface NovoFuncionarioData {
  nome: string;
  email?: string;
  cpf_cnpj: string;
  salario: number;
  dia_pagamento: number;
  data_base_pagamento?: string;
  cargo: string;
  foto_url?: string;
  fotoFile?: File | null;
  removerFoto?: boolean;
}

interface NovoFuncionarioModalProps {
  onClose: () => void;
  onSave: (data: NovoFuncionarioData) => Promise<void>;
  initialData?: NovoFuncionarioData;
}

const FORM_EMPTY: NovoFuncionarioData = {
  nome: "",
  email: "",
  cpf_cnpj: "",
  salario: 0,
  dia_pagamento: 1,
  data_base_pagamento: "",
  cargo: "",
};

export function NovoFuncionarioModal({ onClose, onSave, initialData }: NovoFuncionarioModalProps) {
  const [form, setForm] = useState<NovoFuncionarioData>(initialData || FORM_EMPTY);
  const [cargos, setCargos] = useState<CargoBackend[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargosService.listarCargos().then((res) => {
      setCargos(res);
      if (res.length > 0 && !initialData) {
        setForm((f) => ({ ...f, cargo: res[0].id }));
      }
    }).catch(() => {
      setError("Não foi possível carregar os cargos. Feche o modal e tente novamente.");
    });
  }, [initialData]);

  function handleChange(key: keyof NovoFuncionarioData, value: string | number) {
    setForm((f) => ({ ...f, [key]: key === "cpf_cnpj" ? formatCpfCnpj(String(value)) : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.email.includes("@") || !form.email.includes(".")) {
      setError("Insira um e-mail válido.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o funcionário.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose} maxWidth="720px">
      <ModalHeader
        eyebrow="Funcionários (RH)"
        title={initialData ? "Editar funcionário" : "Novo funcionário"}
        subtitle="Dados trabalhistas usados na folha e nas contas a pagar"
        onClose={onClose}
      />

      <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
        <AvatarPicker
          nome={form.nome}
          fotoUrl={form.foto_url}
          onFile={(file) => {
            const objectUrl = URL.createObjectURL(file);
            setForm((f) => ({ ...f, fotoFile: file, foto_url: objectUrl, removerFoto: false }));
          }}
          onRemove={() => setForm((f) => ({ ...f, fotoFile: null, foto_url: undefined, removerFoto: true }))}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nome completo" required>
            <Input
              required
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              placeholder="Ex: João da Silva"
            />
          </Field>
          <Field label="E-mail" required>
            <Input
              required
              type="email"
              value={form.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="joao@email.com"
            />
          </Field>
          <Field label="CPF ou CNPJ" required>
            <Input
              required
              inputMode="numeric"
              value={form.cpf_cnpj}
              onChange={(e) => handleChange("cpf_cnpj", e.target.value)}
              placeholder="000.000.000-00"
            />
          </Field>
          <Field label="Salário" required>
            <Input
              required
              inputMode="numeric"
              value={formatCurrencyInput(form.salario) || ""}
              onChange={(e) => handleChange("salario", parseCurrency(e.target.value))}
              placeholder="R$ 0,00"
            />
          </Field>
          <Field label="Dia do pagamento" required hint="Gera a conta a pagar do salário todo mês nesse dia.">
            <Input
              required
              type="date"
              value={form.data_base_pagamento || ""}
              onChange={(e) => {
                const val = e.target.value;
                const dia = val ? parseInt(val.split("-")[2], 10) : 1;
                setForm((f) => ({ ...f, data_base_pagamento: val, dia_pagamento: dia }));
              }}
            />
          </Field>
          <Field label="Cargo" required>
            <Select
              required
              value={form.cargo}
              onChange={(e) => handleChange("cargo", e.target.value)}
            >
              {cargos.length === 0 && <option value="">Sem cargos criados</option>}
              {cargos.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </Select>
          </Field>
        </div>

        {error && <FormAlert>{error}</FormAlert>}

        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            <Plus size={14} strokeWidth={2.5} />
            {saving ? "Salvando..." : initialData ? "Salvar alterações" : "Cadastrar funcionário"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

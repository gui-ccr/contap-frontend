"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { cargosService, type CargoBackend } from "@/features/cargos/cargosService";
import { funcionariosService } from "@/features/funcionarios/funcionariosService";
import type { FuncionarioBackend } from "@/features/funcionarios/types/types";
import { Modal, ModalHeader, ModalFooter } from "@/ui/Modal";
import { Field, Input, Select, Button, FormAlert } from "@/ui/forms";
import { AvatarPicker } from "@/ui/forms/AvatarPicker";
import { formatCpfCnpj, formatCurrencyInput, parseCurrency } from "@/utils/format";

export interface NovoUsuarioData {
  modo: "novo" | "existente" | "editar";
  nome: string;
  email: string;
  cargo: string;
  cpf_cnpj?: string;
  salario?: number;
  data_base_pagamento?: string;
  funcionario_id?: string;
  ativo?: boolean;
  foto_url?: string;
  fotoFile?: File | null;
  removerFoto?: boolean;
}

interface NovoUsuarioModalProps {
  onClose: () => void;
  onSave: (data: NovoUsuarioData) => Promise<void>;
  initialData?: NovoUsuarioData;
}

const FORM_EMPTY: NovoUsuarioData = {
  modo: "existente",
  nome: "",
  email: "",
  cargo: "",
  cpf_cnpj: "",
  salario: 0,
  data_base_pagamento: "",
  funcionario_id: "",
};

export function NovoUsuarioModal({ onClose, onSave, initialData }: NovoUsuarioModalProps) {
  const [form, setForm] = useState<NovoUsuarioData>(initialData || FORM_EMPTY);
  const [cargos, setCargos] = useState<CargoBackend[]>([]);
  const [funcionarios, setFuncionarios] = useState<FuncionarioBackend[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      cargosService.listarCargos(),
      funcionariosService.listarFuncionarios(),
    ]).then(([resCargos, resFuncionarios]) => {
      const comEmail = resFuncionarios.filter((f) => !!f.email);
      setCargos(resCargos);
      setFuncionarios(comEmail);

      if (!initialData) {
        setForm((f) => ({
          ...f,
          cargo: resCargos[0]?.id ?? f.cargo,
          funcionario_id: comEmail[0]?.id ?? f.funcionario_id,
        }));
      }
    }).catch(() => {
      setError("Não foi possível carregar cargos e funcionários. Feche o modal e tente novamente.");
    });
  }, [initialData]);

  function handleChange(key: keyof NovoUsuarioData, value: string | number | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const funcionarioSelecionado = funcionarios.find((f) => f.id === form.funcionario_id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const finalData = { ...form };

    if (form.modo === "novo") {
      if (!form.email || !form.email.includes("@") || !form.email.includes(".")) {
        setError("Insira um e-mail válido.");
        return;
      }
      if (!form.cpf_cnpj) {
        setError("CPF ou CNPJ é obrigatório.");
        return;
      }
    } else if (form.modo === "existente") {
      if (!funcionarioSelecionado) {
        setError("Selecione um funcionário.");
        return;
      }
      finalData.nome = funcionarioSelecionado.nome;
      finalData.email = funcionarioSelecionado.email;
      finalData.cargo = funcionarioSelecionado.cargo;
      finalData.cpf_cnpj = funcionarioSelecionado.cpf_cnpj;
      finalData.foto_url = funcionarioSelecionado.foto_url;
      finalData.salario = funcionarioSelecionado.salario;
    }

    try {
      setSaving(true);
      setError("");
      await onSave(finalData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o usuário.");
    } finally {
      setSaving(false);
    }
  }

  const isEditar = form.modo === "editar";

  return (
    <Modal open onClose={onClose} maxWidth="720px">
      <ModalHeader
        eyebrow="Usuários"
        title={isEditar ? "Editar acesso ao sistema" : "Conceder acesso ao sistema"}
        subtitle={
          isEditar
            ? "Atualize os dados de acesso"
            : "Cadastre um novo usuário ou importe um funcionário existente"
        }
        onClose={onClose}
      />

      {!isEditar && (
        <div className="px-6 pt-5 flex gap-4 border-b border-outline-variant/30">
          {([
            ["existente", "Funcionário existente"],
            ["novo", "Cadastrar novo"],
          ] as const).map(([modo, label]) => (
            <button
              key={modo}
              type="button"
              onClick={() => setForm((f) => ({ ...f, modo }))}
              className={`pb-3 text-label-md transition-colors cursor-pointer ${
                form.modo === modo
                  ? "border-b-2 border-primary text-primary"
                  : "text-on-surface-variant/60 hover:text-on-surface"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
        {form.modo === "existente" ? (
          <>
            <Field
              label="Funcionário"
              required
              hint="Somente funcionários que já possuem e-mail cadastrado aparecem na lista."
            >
              <Select
                required
                value={form.funcionario_id}
                onChange={(e) => handleChange("funcionario_id", e.target.value)}
              >
                {funcionarios.length === 0 && (
                  <option value="">Nenhum funcionário com e-mail cadastrado</option>
                )}
                {funcionarios.map((f) => (
                  <option key={f.id} value={f.id}>{f.nome} ({f.email})</option>
                ))}
              </Select>
            </Field>

            {funcionarioSelecionado && (
              <div className="p-4 rounded-xl flex items-center gap-4 bg-surface-container-low border border-outline-variant/40">
                <div
                  className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center"
                  style={
                    funcionarioSelecionado.foto_url
                      ? { background: `url(${funcionarioSelecionado.foto_url}) center/cover no-repeat` }
                      : { background: "linear-gradient(135deg, var(--color-primary), var(--color-inverse-primary))" }
                  }
                >
                  {!funcionarioSelecionado.foto_url && (
                    <span className="text-lg font-bold text-on-primary">
                      {funcionarioSelecionado.nome.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-body-sm flex-1">
                  <p className="text-on-surface font-semibold sm:col-span-2">{funcionarioSelecionado.nome}</p>
                  <p className="text-on-surface-variant/70">E-mail: <span className="text-on-surface">{funcionarioSelecionado.email}</span></p>
                  <p className="text-on-surface-variant/70">Cargo: <span className="text-on-surface">{funcionarioSelecionado.cargo || "—"}</span></p>
                  <p className="text-on-surface-variant/70">CPF/CNPJ: <span className="text-on-surface">{formatCpfCnpj(funcionarioSelecionado.cpf_cnpj || "") || "—"}</span></p>
                  <p className="text-on-surface-variant/70">Salário: <span className="text-on-surface">{funcionarioSelecionado.salario ? formatCurrencyInput(funcionarioSelecionado.salario) : "—"}</span></p>
                </div>
              </div>
            )}

            <FormAlert tone="info">
              O funcionário entra com o e-mail dele e a senha inicial é o próprio CPF/CNPJ.
              O cargo no sistema será o mesmo que ele já possui.
            </FormAlert>
          </>
        ) : (
          <>
            <AvatarPicker
              nome={form.nome}
              fotoUrl={form.foto_url}
              onFile={(file) => {
                const objectUrl = URL.createObjectURL(file);
                setForm((f) => ({ ...f, fotoFile: file, foto_url: objectUrl, removerFoto: false }));
              }}
              onRemove={() => setForm((f) => ({ ...f, fotoFile: null, foto_url: undefined, removerFoto: true }))}
            />

            {isEditar ? (
              <>
                <Field label="Nome completo" required>
                  <Input
                    required
                    value={form.nome}
                    onChange={(e) => handleChange("nome", e.target.value)}
                    placeholder="Ex: João da Silva"
                  />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Cargo" required>
                    <Select
                      required
                      value={form.cargo}
                      onChange={(e) => handleChange("cargo", e.target.value)}
                    >
                      {cargos.length === 0 && <option value="">Sem cargos criados</option>}
                      {cargos.map((c) => <option key={c.id} value={c.nome}>{c.nome}</option>)}
                    </Select>
                  </Field>
                  <label className="flex items-center gap-2 cursor-pointer self-end pb-2.5">
                    <input
                      type="checkbox"
                      checked={!!form.ativo}
                      onChange={(e) => handleChange("ativo", e.target.checked)}
                      className="w-4 h-4 rounded accent-[var(--color-primary)]"
                    />
                    <span className="text-body-sm text-on-surface">Usuário ativo</span>
                  </label>
                </div>
              </>
            ) : (
              <>
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
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="joao.silva@empresa.com"
                    />
                  </Field>
                  <Field label="CPF ou CNPJ" required hint="Será a senha inicial do usuário.">
                    <Input
                      required
                      inputMode="numeric"
                      value={formatCpfCnpj(form.cpf_cnpj || "")}
                      onChange={(e) => handleChange("cpf_cnpj", formatCpfCnpj(e.target.value))}
                      placeholder="Apenas números"
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
                  <Field label="Salário" required>
                    <Input
                      required
                      inputMode="numeric"
                      value={formatCurrencyInput(form.salario || 0) || ""}
                      onChange={(e) => handleChange("salario", parseCurrency(e.target.value))}
                      placeholder="R$ 0,00"
                    />
                  </Field>
                  <Field label="Dia do pagamento" required>
                    <Input
                      required
                      type="date"
                      value={form.data_base_pagamento || ""}
                      onChange={(e) => handleChange("data_base_pagamento", e.target.value)}
                    />
                  </Field>
                </div>
              </>
            )}
          </>
        )}

        {error && <FormAlert>{error}</FormAlert>}

        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            <Plus size={14} strokeWidth={2.5} />
            {saving ? "Salvando..." : isEditar ? "Salvar alterações" : "Conceder acesso"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

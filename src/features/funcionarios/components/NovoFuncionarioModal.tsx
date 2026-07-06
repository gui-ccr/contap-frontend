"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { cargosService, type CargoBackend } from "@/features/cargos/cargosService";
import { Modal, ModalHeader, ModalFooter } from "@/ui/Modal";
import { Field, Input, Select, Button, FormAlert } from "@/ui/forms";
import { AvatarPicker } from "@/ui/forms/AvatarPicker";
import { formatCpfCnpj, formatCurrencyInput, parseCurrency } from "@/utils/format";
import { DatePicker } from "@/ui/application/date-picker/date-picker";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "react-aria-components";

export interface IConfigFolha {
  descontos: {
    inss: { calculo_automatico: boolean; valor_fixo: number | null };
    fgts: { calculo_automatico: boolean };
    irrf: { dependentes: number | string };
  };
  beneficios: {
    vale_transporte: { ativo: boolean; valor_desconto: number };
    vale_refeicao: { ativo: boolean; valor_desconto: number };
    plano_saude: { ativo: boolean; valor_desconto: number };
  };
}

export interface NovoFuncionarioData {
  nome: string;
  email?: string;
  cpf_cnpj: string;
  salario: number;
  data_admissao: string;
  cargo: string;
  config_folha?: IConfigFolha;
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
  data_admissao: "",
  cargo: "",
  config_folha: {
    descontos: {
      inss: { calculo_automatico: true, valor_fixo: null },
      fgts: { calculo_automatico: true },
      irrf: { dependentes: 0 }
    },
    beneficios: {
      vale_transporte: { ativo: false, valor_desconto: 0 },
      vale_refeicao: { ativo: false, valor_desconto: 0 },
      plano_saude: { ativo: false, valor_desconto: 0 }
    }
  }
};

function getSafeConfig(config?: any): IConfigFolha {
  return {
    descontos: {
      inss: { calculo_automatico: config?.descontos?.inss?.calculo_automatico ?? true, valor_fixo: config?.descontos?.inss?.valor_fixo ?? null },
      fgts: { calculo_automatico: config?.descontos?.fgts?.calculo_automatico ?? true },
      irrf: { dependentes: config?.descontos?.irrf?.dependentes ?? 0 }
    },
    beneficios: {
      vale_transporte: { ativo: config?.beneficios?.vale_transporte?.ativo ?? false, valor_desconto: config?.beneficios?.vale_transporte?.valor_desconto ?? 0 },
      vale_refeicao: { ativo: config?.beneficios?.vale_refeicao?.ativo ?? false, valor_desconto: config?.beneficios?.vale_refeicao?.valor_desconto ?? 0 },
      plano_saude: { ativo: config?.beneficios?.plano_saude?.ativo ?? false, valor_desconto: config?.beneficios?.plano_saude?.valor_desconto ?? 0 }
    }
  };
}

export function NovoFuncionarioModal({ onClose, onSave, initialData }: NovoFuncionarioModalProps) {
  const [form, setForm] = useState<NovoFuncionarioData>(initialData ? { ...initialData, config_folha: getSafeConfig(initialData.config_folha) } : FORM_EMPTY);
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

      // Ensure dependentes is a number before saving
      const dataToSave = { ...form };
      if (dataToSave.config_folha?.descontos?.irrf) {
        dataToSave.config_folha.descontos.irrf.dependentes = 
          Number(dataToSave.config_folha.descontos.irrf.dependentes) || 0;
      }

      await onSave(dataToSave);
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
          <Field label="Data de Admissão" required hint="O primeiro salário será pago no quinto dia útil do mês seguinte, proporcional aos dias trabalhados.">
            <DatePicker
              value={form.data_admissao ? parseDate(form.data_admissao) : null}
              onChange={(v: DateValue | null) => {
                const val = v ? v.toString() : "";
                setForm((f) => ({ ...f, data_admissao: val }));
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

        <div className="mt-4 pt-4 border-t border-white/5">
          <h3 className="text-sm font-semibold mb-4 text-gray-200">Configurações de Folha (Impostos e Benefícios)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Dependentes (IRRF)" hint="Quantidade de dependentes para dedução legal.">
              <Input
                inputMode="numeric"
                value={form.config_folha?.descontos?.irrf?.dependentes?.toString() ?? "0"}
                onChange={(e) => setForm(f => {
                  const safeConfig = getSafeConfig(f.config_folha);
                  const rawValue = e.target.value.replace(/\D/g, '');
                  return {
                    ...f,
                    config_folha: {
                      ...safeConfig,
                      descontos: { ...safeConfig.descontos, irrf: { dependentes: rawValue } }
                    }
                  };
                })}
              />
            </Field>

            <Field label="Desconto Vale Transporte (R$)">
              <Input
                inputMode="numeric"
                value={formatCurrencyInput(form.config_folha?.beneficios?.vale_transporte?.valor_desconto ?? 0)}
                onChange={(e) => setForm(f => {
                  const safeConfig = getSafeConfig(f.config_folha);
                  return {
                    ...f,
                    config_folha: {
                      ...safeConfig,
                      beneficios: {
                        ...safeConfig.beneficios,
                        vale_transporte: { ativo: true, valor_desconto: parseCurrency(e.target.value) }
                      }
                    }
                  };
                })}
              />
            </Field>

            <Field label="Desconto Vale Refeição (R$)">
              <Input
                inputMode="numeric"
                value={formatCurrencyInput(form.config_folha?.beneficios?.vale_refeicao?.valor_desconto ?? 0)}
                onChange={(e) => setForm(f => {
                  const safeConfig = getSafeConfig(f.config_folha);
                  return {
                    ...f,
                    config_folha: {
                      ...safeConfig,
                      beneficios: {
                        ...safeConfig.beneficios,
                        vale_refeicao: { ativo: true, valor_desconto: parseCurrency(e.target.value) }
                      }
                    }
                  };
                })}
              />
            </Field>

            <Field label="Desconto Plano de Saúde (R$)">
              <Input
                inputMode="numeric"
                value={formatCurrencyInput(form.config_folha?.beneficios?.plano_saude?.valor_desconto ?? 0)}
                onChange={(e) => setForm(f => {
                  const safeConfig = getSafeConfig(f.config_folha);
                  return {
                    ...f,
                    config_folha: {
                      ...safeConfig,
                      beneficios: {
                        ...safeConfig.beneficios,
                        plano_saude: { ativo: true, valor_desconto: parseCurrency(e.target.value) }
                      }
                    }
                  };
                })}
              />
            </Field>
          </div>
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

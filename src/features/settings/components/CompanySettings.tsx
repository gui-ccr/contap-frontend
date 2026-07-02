/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import { useAuth } from "@/shared/AuthContext";
import { apiClient } from "@/shared/api";
import { Field, SelectField, SettingsCard, SectionHeader, SaveButton, type SaveState } from "./settingsUi";

export function CompanySettings() {
  const { empresa, refreshUserData } = useAuth();

  const [company, setCompany] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [timezone, setTimezone] = useState("america_sao_paulo");
  const [currency, setCurrency] = useState("brl");
  const [state, setState] = useState<SaveState>("idle");

  useEffect(() => {
    if (empresa) {
      setCompany(empresa.razao_social || "");
      setCnpj(empresa.cnpj || "");
    }
  }, [empresa]);

  const save = async () => {
    if (!empresa) return;
    setState("loading");
    try {
      await apiClient.put(`/empresas/${empresa.id}`, {
        razao_social: company,
        cnpj: cnpj.replace(/\D/g, ""), // Manda s numeros
      });
      await refreshUserData();
      setState("saved");
      setTimeout(() => setState("idle"), 2000);
    } catch (err) {
      console.error(err);
      setState("idle");
    }
  };

  return (
    <SettingsCard>
      <SectionHeader
        icon={Building2}
        title="Conta & Empresa"
        subtitle="Dados corporativos e configurações regionais"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Nome da empresa"
          value={company}
          onChange={setCompany}
          placeholder="Razão social"
        />
        <Field
          label="CNPJ"
          value={cnpj}
          onChange={setCnpj}
          placeholder="00.000.000/0000-00"
        />
        <SelectField
          label="Fuso horário"
          value={timezone}
          onChange={setTimezone}
          options={[
            { label: "Brasília (GMT-3)", value: "america_sao_paulo" },
            { label: "Manaus (GMT-4)", value: "america_manaus" },
            { label: "Recife (GMT-3)", value: "america_recife" },
            { label: "Porto Velho (GMT-4)", value: "america_porto_velho" },
          ]}
        />
        <SelectField
          label="Moeda padrão"
          value={currency}
          onChange={setCurrency}
          options={[
            { label: "Real Brasileiro (R$)", value: "brl" },
            { label: "Dólar Americano ($)", value: "usd" },
            { label: "Euro (€)", value: "eur" },
          ]}
        />
      </div>
      <SaveButton state={state} onClick={save} />
    </SettingsCard>
  );
}

// ─────────────────────────────────────────────────────────────
// SEÇÃO 3 — PREFERÊNCIAS DO SISTEMA

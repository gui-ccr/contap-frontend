"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { TextInput } from "@/ui/TextInput";

function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function CompanyForm() {
  const [razaoSocial, setRazaoSocial] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [errors, setErrors] = useState({ razaoSocial: "", nomeFantasia: "", cnpj: "" });

  const handleCnpjChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCnpj(formatCNPJ(e.target.value));
    if (errors.cnpj) setErrors((prev) => ({ ...prev, cnpj: "" }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = { razaoSocial: "", nomeFantasia: "", cnpj: "" };
    let hasError = false;

    if (!razaoSocial.trim()) { newErrors.razaoSocial = "A Razão Social é obrigatória."; hasError = true; }
    if (!nomeFantasia.trim()) { newErrors.nomeFantasia = "O Nome Fantasia é obrigatório."; hasError = true; }

    const cleanCnpj = cnpj.replace(/\D/g, "");
    if (!cleanCnpj) { newErrors.cnpj = "O CNPJ é obrigatório."; hasError = true; }
    else if (cleanCnpj.length !== 14) { newErrors.cnpj = "O CNPJ deve conter exatamente 14 dígitos."; hasError = true; }

    if (hasError) { setErrors(newErrors); return; }

    console.log("Payload pronto para envio:", {
      razao_social: razaoSocial.trim(),
      nome_fantasia: nomeFantasia.trim(),
      cnpj: cleanCnpj,
    });
  };

  return (
    <form className="flex flex-col gap-gutter" onSubmit={handleSubmit}>
      <TextInput
        label="Razão Social"
        name="razaoSocial"
        iconName="domain"
        placeholder="Razão Social da Empresa"
        value={razaoSocial}
        onChange={(e) => { setRazaoSocial(e.target.value); if (errors.razaoSocial) setErrors((p) => ({ ...p, razaoSocial: "" })); }}
        error={errors.razaoSocial}
        required
      />

      <TextInput
        label="Nome Fantasia"
        name="nomeFantasia"
        iconName="store"
        placeholder="Nome Fantasia da Empresa"
        value={nomeFantasia}
        onChange={(e) => { setNomeFantasia(e.target.value); if (errors.nomeFantasia) setErrors((p) => ({ ...p, nomeFantasia: "" })); }}
        error={errors.nomeFantasia}
        required
      />

      <TextInput
        label="CNPJ"
        name="cnpj"
        iconName="fingerprint"
        placeholder="00.000.000/0001-00"
        value={cnpj}
        onChange={handleCnpjChange}
        error={errors.cnpj}
        required
      />

      <div className="pt-sm flex flex-col gap-base">
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-fixed active:scale-[0.98] text-on-primary text-label-md py-3 px-4 rounded-xl transition-all duration-200 flex justify-center items-center gap-base shadow-lg shadow-primary/20"
        >
          Cadastrar Empresa
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-label-sm text-primary hover:text-primary-fixed transition-colors text-center"
        >
          Cancelar e Voltar
        </button>
      </div>
    </form>
  );
}

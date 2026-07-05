"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TextInput } from "@/ui/TextInput";
import { apiClient } from "@/shared/api";

function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function CompanyForm() {
  const router = useRouter();
  const [razaoSocial, setRazaoSocial] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [errors, setErrors] = useState({ razaoSocial: "", nomeFantasia: "", cnpj: "" });
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCnpjChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCnpj(formatCNPJ(e.target.value));
    if (errors.cnpj) setErrors((prev) => ({ ...prev, cnpj: "" }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = { razaoSocial: "", nomeFantasia: "", cnpj: "" };
    setApiError("");
    let hasError = false;

    if (!razaoSocial.trim()) { newErrors.razaoSocial = "A Razão Social é obrigatória."; hasError = true; }
    if (!nomeFantasia.trim()) { newErrors.nomeFantasia = "O Nome Fantasia é obrigatório."; hasError = true; }

    const cleanCnpj = cnpj.replace(/\D/g, "");
    if (!cleanCnpj) { newErrors.cnpj = "O CNPJ é obrigatório."; hasError = true; }
    else if (cleanCnpj.length !== 14) { newErrors.cnpj = "O CNPJ deve conter exatamente 14 dígitos."; hasError = true; }

    if (hasError) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      await apiClient.post("/empresas", {
        nome: nomeFantasia.trim(),
        nome_fantasia: nomeFantasia.trim(),
        razao_social: razaoSocial.trim(),
        cnpj: cleanCnpj,
      });

      const { getSupabaseClient } = await import("@/shared/supabaseClient");
      await getSupabaseClient().auth.refreshSession();

      router.push("/dashboard" as never);
    } catch (err: any) {
      setApiError(err.message || "Erro ao cadastrar a empresa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-gutter" onSubmit={handleSubmit}>
      {apiError && <p className="text-error text-sm">{apiError}</p>}
      <TextInput
        label="Razão Social"
        name="razaoSocial"
        iconName="fi-rr-building"
        placeholder="Razão Social da Empresa"
        value={razaoSocial}
        onChange={(e) => { setRazaoSocial(e.target.value); if (errors.razaoSocial) setErrors((p) => ({ ...p, razaoSocial: "" })); }}
        error={errors.razaoSocial}
        required
      />

      <TextInput
        label="Nome Fantasia"
        name="nomeFantasia"
        iconName="fi-rr-shop"
        placeholder="Nome Fantasia da Empresa"
        value={nomeFantasia}
        onChange={(e) => { setNomeFantasia(e.target.value); if (errors.nomeFantasia) setErrors((p) => ({ ...p, nomeFantasia: "" })); }}
        error={errors.nomeFantasia}
        required
      />

      <TextInput
        label="CNPJ"
        name="cnpj"
        iconName="fi-rr-fingerprint"
        placeholder="00.000.000/0001-00"
        value={cnpj}
        onChange={handleCnpjChange}
        error={errors.cnpj}
        required
      />

      <div className="pt-sm flex flex-col gap-base">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-fixed active:scale-[0.98] disabled:opacity-50 text-on-primary text-label-md py-3 px-4 rounded-xl transition-all duration-200 flex justify-center items-center gap-base shadow-lg shadow-primary/20 cursor-pointer"
        >
          {loading ? "Cadastrando..." : "Cadastrar Empresa"}
          {!loading && <i className="fi fi-rr-arrow-right text-[18px]"></i>}
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

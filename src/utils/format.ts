/** Helpers de formatação pt-BR compartilhados pelos formulários e tabelas. */

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** Formata um número como moeda BRL para exibição. */
export function formatCurrency(value: number): string {
  return BRL.format(value);
}

/** Formata o valor de um input de moeda (aceita número ou string de dígitos). */
export function formatCurrencyInput(value: string | number): string {
  const numeric = typeof value === "string" ? Number(value.replace(/\D/g, "")) / 100 : value;
  if (isNaN(numeric)) return "";
  return BRL.format(numeric);
}

/** Converte a string exibida de um input de moeda de volta para número. */
export function parseCurrency(value: string): number {
  return Number(value.replace(/\D/g, "")) / 100;
}

/** Aplica máscara de CPF (11 dígitos) ou CNPJ (14 dígitos). */
export function formatCpfCnpj(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return digits
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

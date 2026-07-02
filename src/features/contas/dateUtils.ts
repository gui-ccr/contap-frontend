export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr + "T12:00:00Z").toLocaleDateString("pt-BR");
}

/** Dias entre hoje e a data (negativo = já passou). */
export function getDiffDays(dateStr: string): number {
  const alvo = new Date(dateStr + "T12:00:00Z");
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.ceil((alvo.getTime() - hoje.getTime()) / 86400000);
}

export function primeiroDiaDoMes(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split("T")[0];
}

export function ultimoDiaDoMes(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split("T")[0];
}

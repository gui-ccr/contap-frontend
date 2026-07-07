import { jsPDF } from "jspdf";
import { apiClient, getEmpresaIdFromToken } from "@/shared/api";

// ─── Tipos ─────────────────────────────────────────────────────────────────────

export interface EmpresaInfo {
  razaoSocial: string;
  cnpj: string;
}

export interface DREExportData {
  receitas: { nome: string; saldo: number }[];
  despesas: { nome: string; saldo: number }[];
  custos: { nome: string; saldo: number }[];
  totalReceitas: number;
  totalDespesas: number;
  totalCustos: number;
  resultadoLiquido: number;
}

export interface BalancoExportData {
  ativoCirculante: { label: string; valor: number }[];
  ativoNaoCirculante: { label: string; valor: number }[];
  passivoCirculante: { label: string; valor: number }[];
  passivoNaoCirculante: { label: string; valor: number }[];
  patrimonioLiquido: { label: string; valor: number }[];
  totalAtivo: number;
  totalPassivo: number;
  equacaoValida: boolean;
}

export interface LancamentoExportRow {
  data: string;
  descricao: string;
  debito: string;
  credito: string;
  valor: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const BRL = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

function formatCNPJ(cnpj: string): string {
  const d = cnpj.replace(/\D/g, "");
  return d.length === 14
    ? d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
    : cnpj;
}

async function getEmpresaInfo(): Promise<EmpresaInfo> {
  let razaoSocial = "Empresa";
  let cnpj = "00.000.000/0000-00";
  try {
    const empresaId = getEmpresaIdFromToken();
    if (empresaId) {
      const empresa = await apiClient.get<any>(`/empresas/${empresaId}`);
      if (empresa) {
        razaoSocial = empresa.razaoSocial || razaoSocial;
        cnpj = empresa.cnpj || cnpj;
      }
    }
  } catch { /* silencioso */ }
  return { razaoSocial, cnpj };
}

/** Preenche o fundo escuro de toda a página */
function fillPageBackground(pdf: jsPDF) {
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  pdf.setFillColor(22, 22, 24); // #161618
  pdf.rect(0, 0, W, H, "F");
}

/** Desenha o cabeçalho oficial e retorna o Y inicial do conteúdo */
function drawHeader(
  pdf: jsPDF,
  reportName: string,
  periodText: string,
  empresa: EmpresaInfo
): number {
  const W = pdf.internal.pageSize.getWidth();
  fillPageBackground(pdf);

  // Barra verde topo
  pdf.setFillColor(0, 230, 118);
  pdf.rect(0, 0, W, 2.5, "F");

  // Área do cabeçalho levemente mais clara
  pdf.setFillColor(28, 28, 30);
  pdf.rect(0, 2.5, W, 62, "F");

  // Título
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text(reportName, W / 2, 20, { align: "center" });

  // Dados da empresa
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(150, 150, 155);
  pdf.text(`Razão Social: ${empresa.razaoSocial}`, 12, 33);
  pdf.text(`CNPJ: ${formatCNPJ(empresa.cnpj)}`, 12, 41);
  pdf.text(`Encerramento do Exercício: ${periodText}`, 12, 49);
  pdf.text(`Data de Geração: ${new Date().toLocaleDateString("pt-BR")}`, 12, 57);

  // Linha separadora
  pdf.setDrawColor(0, 230, 118);
  pdf.setLineWidth(0.3);
  pdf.line(12, 63, W - 12, 63);

  return 70;
}

/** Adiciona uma nova página já com fundo escuro e retorna Y=14 */
function addDarkPage(pdf: jsPDF): number {
  pdf.addPage();
  fillPageBackground(pdf);
  return 14;
}

interface Col { header: string; width: number; align?: "left" | "right" | "center" }

/** Desenha uma tabela e retorna o próximo Y */
function drawTable(
  pdf: jsPDF,
  cols: Col[],
  rows: string[][],
  startY: number,
  opts?: { rowHeight?: number; fontSize?: number; headerBg?: [number, number, number] }
): number {
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const mX = 12;
  const rH = opts?.rowHeight ?? 7;
  const fz = opts?.fontSize ?? 8;
  const hBg = opts?.headerBg ?? [38, 38, 42];

  let y = startY;
  const total = cols.reduce((s, c) => s + c.width, 0);
  const scale = (W - mX * 2) / total;
  const sC = cols.map((c) => ({ ...c, width: c.width * scale }));

  const renderHeader = (yh: number) => {
    pdf.setFillColor(...hBg);
    pdf.rect(mX, yh, W - mX * 2, rH, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(fz - 0.5);
    pdf.setTextColor(170, 170, 175);
    let x = mX;
    sC.forEach((col) => {
      const tx = col.align === "right" ? x + col.width - 2 : x + 2;
      pdf.text(col.header, tx, yh + rH - 2, { align: col.align ?? "left" });
      x += col.width;
    });
    return yh + rH;
  };

  y = renderHeader(y);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(fz);

  rows.forEach((row, i) => {
    if (y + rH > H - 12) {
      y = addDarkPage(pdf);
      y = renderHeader(y);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(fz);
    }

    // Fundo alternado
    if (i % 2 === 0) {
      pdf.setFillColor(30, 30, 34);
      pdf.rect(mX, y, W - mX * 2, rH, "F");
    }

    pdf.setTextColor(210, 210, 215);
    let cx = mX;
    row.forEach((cell, j) => {
      const col = sC[j];
      const cellX = col.align === "right" ? cx + col.width - 2 : cx + 2;
      // Trunca texto longo
      const maxChars = Math.floor(col.width / (fz * 0.35));
      const text = String(cell ?? "");
      const displayText = text.length > maxChars ? text.slice(0, maxChars - 1) + "…" : text;
      pdf.text(displayText, cellX, y + rH - 2, { align: col.align ?? "left" });
      cx += col.width;
    });

    // Borda inferior da linha
    pdf.setDrawColor(40, 40, 44);
    pdf.setLineWidth(0.1);
    pdf.line(mX, y + rH, W - mX, y + rH);

    y += rH;
  });

  return y + 4;
}

function drawSectionTitle(
  pdf: jsPDF,
  title: string,
  y: number,
  color: [number, number, number] = [0, 230, 118]
): number {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8.5);
  pdf.setTextColor(...color);
  pdf.text(title.toUpperCase(), 12, y);
  pdf.setDrawColor(...color);
  pdf.setLineWidth(0.2);
  pdf.line(12, y + 1.5, 12 + pdf.getTextWidth(title.toUpperCase()), y + 1.5);
  return y + 8;
}

function drawTotalRow(
  pdf: jsPDF,
  label: string,
  value: string,
  y: number,
  color: [number, number, number] = [0, 230, 118]
): number {
  const W = pdf.internal.pageSize.getWidth();
  pdf.setFillColor(32, 32, 36);
  pdf.rect(12, y, W - 24, 8, "F");
  pdf.setDrawColor(...color);
  pdf.setLineWidth(0.2);
  pdf.rect(12, y, W - 24, 8);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8.5);
  pdf.setTextColor(...color);
  pdf.text(label, 15, y + 5.5);
  pdf.text(value, W - 14, y + 5.5, { align: "right" });
  return y + 12;
}

// ─── Exportações públicas ──────────────────────────────────────────────────────

export async function exportDREToPDF(data: DREExportData, periodText: string): Promise<void> {
  const empresa = await getEmpresaInfo();
  const pdf = new jsPDF("p", "mm", "a4");
  const W = pdf.internal.pageSize.getWidth();

  let y = drawHeader(pdf, "Demonstração do Resultado do Exercício (DRE)", periodText, empresa);

  // Receitas
  y = drawSectionTitle(pdf, "Receita Operacional Bruta", y, [0, 230, 118]);
  if (data.receitas.length > 0) {
    y = drawTable(pdf,
      [{ header: "Conta de Receita", width: 120 }, { header: "Valor (R$)", width: 50, align: "right" }],
      data.receitas.map((r) => [r.nome, BRL(r.saldo)]), y);
  } else {
    pdf.setTextColor(100, 100, 105); pdf.setFontSize(8);
    pdf.text("Nenhuma receita lançada no período.", 12, y + 4); y += 10;
  }
  y = drawTotalRow(pdf, "= TOTAL DE RECEITAS", BRL(data.totalReceitas), y, [0, 230, 118]);

  y += 5;

  // Custos e Despesas
  y = drawSectionTitle(pdf, "Custos e Despesas Operacionais", y, [255, 82, 82]);
  const deducoes = [...data.custos, ...data.despesas];
  if (deducoes.length > 0) {
    y = drawTable(pdf,
      [{ header: "Conta de Despesa / Custo", width: 120 }, { header: "Valor (R$)", width: 50, align: "right" }],
      deducoes.map((r) => [r.nome, `(${BRL(r.saldo)})`]), y,
      { headerBg: [50, 28, 28] });
  } else {
    pdf.setTextColor(100, 100, 105); pdf.setFontSize(8);
    pdf.text("Nenhuma despesa lançada no período.", 12, y + 4); y += 10;
  }
  y = drawTotalRow(pdf, "= TOTAL DE DEDUÇÕES", `(${BRL(data.totalDespesas + data.totalCustos)})`, y, [255, 82, 82]);

  y += 8;

  // Resultado final
  const isLucro = data.resultadoLiquido >= 0;
  const cor: [number, number, number] = isLucro ? [0, 230, 118] : [255, 82, 82];
  const boxH = 20;
  pdf.setFillColor(28, 28, 30);
  pdf.rect(12, y, W - 24, boxH, "F");
  pdf.setDrawColor(...cor);
  pdf.setLineWidth(0.5);
  pdf.rect(12, y, W - 24, boxH);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9.5);
  pdf.setTextColor(...cor);
  pdf.text(
    isLucro ? "LUCRO LÍQUIDO DO EXERCÍCIO" : "PREJUÍZO LÍQUIDO DO EXERCÍCIO",
    W / 2, y + 8, { align: "center" }
  );
  pdf.setFontSize(13);
  pdf.text(BRL(data.resultadoLiquido), W / 2, y + 16, { align: "center" });

  pdf.save(`DRE_${periodText.replace(/[\/\\:\s]/g, "-")}.pdf`);
}

export async function exportBalancoToPDF(data: BalancoExportData, dateText: string): Promise<void> {
  const empresa = await getEmpresaInfo();
  const pdf = new jsPDF("p", "mm", "a4");
  const W = pdf.internal.pageSize.getWidth();

  let y = drawHeader(pdf, "Balanço Patrimonial", dateText, empresa);

  // ATIVO
  y = drawSectionTitle(pdf, "ATIVO", y, [100, 180, 255]);

  y = drawSectionTitle(pdf, "Ativo Circulante", y, [130, 190, 255]);
  if (data.ativoCirculante.length > 0) {
    y = drawTable(pdf,
      [{ header: "Conta", width: 120 }, { header: "Valor (R$)", width: 50, align: "right" }],
      data.ativoCirculante.map((i) => [i.label, BRL(i.valor)]), y,
      { headerBg: [28, 38, 58] });
  } else {
    pdf.setTextColor(100, 100, 105); pdf.setFontSize(8);
    pdf.text("Sem contas de ativo circulante.", 12, y + 3); y += 9;
  }

  y = drawSectionTitle(pdf, "Ativo Não Circulante", y, [130, 190, 255]);
  if (data.ativoNaoCirculante.length > 0) {
    y = drawTable(pdf,
      [{ header: "Conta", width: 120 }, { header: "Valor (R$)", width: 50, align: "right" }],
      data.ativoNaoCirculante.map((i) => [i.label, BRL(i.valor)]), y,
      { headerBg: [28, 38, 58] });
  } else {
    pdf.setTextColor(100, 100, 105); pdf.setFontSize(8);
    pdf.text("Sem contas de ativo não circulante.", 12, y + 3); y += 9;
  }
  y = drawTotalRow(pdf, "TOTAL DO ATIVO", BRL(data.totalAtivo), y, [100, 180, 255]);

  y += 7;

  // PASSIVO + PL
  y = drawSectionTitle(pdf, "PASSIVO + PATRIMÔNIO LÍQUIDO", y, [255, 180, 80]);

  y = drawSectionTitle(pdf, "Passivo Circulante", y, [255, 200, 130]);
  if (data.passivoCirculante.length > 0) {
    y = drawTable(pdf,
      [{ header: "Conta", width: 120 }, { header: "Valor (R$)", width: 50, align: "right" }],
      data.passivoCirculante.map((i) => [i.label, BRL(i.valor)]), y,
      { headerBg: [55, 38, 20] });
  } else {
    pdf.setTextColor(100, 100, 105); pdf.setFontSize(8);
    pdf.text("Sem contas de passivo circulante.", 12, y + 3); y += 9;
  }

  y = drawSectionTitle(pdf, "Passivo Não Circulante", y, [255, 200, 130]);
  if (data.passivoNaoCirculante.length > 0) {
    y = drawTable(pdf,
      [{ header: "Conta", width: 120 }, { header: "Valor (R$)", width: 50, align: "right" }],
      data.passivoNaoCirculante.map((i) => [i.label, BRL(i.valor)]), y,
      { headerBg: [55, 38, 20] });
  } else {
    pdf.setTextColor(100, 100, 105); pdf.setFontSize(8);
    pdf.text("Sem contas de passivo não circulante.", 12, y + 3); y += 9;
  }

  y = drawSectionTitle(pdf, "Patrimônio Líquido", y, [255, 200, 130]);
  if (data.patrimonioLiquido.length > 0) {
    y = drawTable(pdf,
      [{ header: "Conta", width: 120 }, { header: "Valor (R$)", width: 50, align: "right" }],
      data.patrimonioLiquido.map((i) => [i.label, BRL(i.valor)]), y,
      { headerBg: [55, 38, 20] });
  } else {
    pdf.setTextColor(100, 100, 105); pdf.setFontSize(8);
    pdf.text("Sem contas de patrimônio líquido.", 12, y + 3); y += 9;
  }
  y = drawTotalRow(pdf, "TOTAL PASSIVO + PL", BRL(data.totalPassivo), y, [255, 180, 80]);

  y += 6;

  // Equação patrimonial
  const eqCor: [number, number, number] = data.equacaoValida ? [0, 230, 118] : [255, 82, 82];
  pdf.setFillColor(28, 28, 30);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(...eqCor);
  
  if (data.equacaoValida) {
    pdf.rect(12, y, W - 24, 10, "F");
    const eqLabel = `✔  Balancete OK — Ativo (${BRL(data.totalAtivo)}) = Passivo + PL (${BRL(data.totalPassivo)})`;
    pdf.text(eqLabel, W / 2, y + 6.5, { align: "center" });
  } else {
    pdf.rect(12, y, W - 24, 14, "F");
    const eqLabel1 = `✘  Balancete divergente`;
    const eqLabel2 = `Ativo (${BRL(data.totalAtivo)}) ≠ Passivo + PL (${BRL(data.totalPassivo)})`;
    pdf.text(eqLabel1, W / 2, y + 6, { align: "center" });
    pdf.text(eqLabel2, W / 2, y + 11, { align: "center" });
  }

  pdf.save(`Balanco_Patrimonial_${dateText.replace(/[\/\\:\s]/g, "-")}.pdf`);
}

export async function exportLivroDiarioToPDF(
  rows: LancamentoExportRow[],
  periodText: string
): Promise<void> {
  const empresa = await getEmpresaInfo();

  // Busca o mapa de contas para resolver UUIDs → nomes
  let contaMap: Record<string, string> = {};
  try {
    const contas = await apiClient.get<any[]>("/plano-contas");
    if (Array.isArray(contas)) {
      contas.forEach((c: any) => {
        const id = c.id || c.conta_id;
        const nome = c.nome || c.name || "";
        const codigo = c.codigo || "";
        if (id) contaMap[id] = codigo ? `${codigo} – ${nome}` : nome;
      });
    }
  } catch { /* se falhar, exibe o UUID encurtado */ }

  const resolveConta = (id: string): string => {
    if (!id || id === "-") return "-";
    if (contaMap[id]) return contaMap[id];
    // fallback: mostra os últimos 8 chars do UUID
    return `…${id.slice(-8)}`;
  };

  const pdf = new jsPDF("l", "mm", "a4"); // landscape

  let y = drawHeader(pdf, "Livro Diário — Lançamentos Contábeis", periodText, empresa);

  if (rows.length === 0) {
    pdf.setTextColor(150, 150, 155);
    pdf.setFontSize(9);
    pdf.text("Nenhum lançamento encontrado para o período selecionado.", 12, y + 6);
  } else {
    y = drawTable(
      pdf,
      [
        { header: "Data", width: 22 },
        { header: "Descrição", width: 88 },
        { header: "Débito", width: 65 },
        { header: "Crédito", width: 65 },
        { header: "Valor (R$)", width: 37, align: "right" },
      ],
      rows.map((r) => [
        r.data,
        r.descricao,
        resolveConta(r.debito),
        resolveConta(r.credito),
        r.valor,
      ]),
      y,
      { rowHeight: 7, fontSize: 7.5 }
    );
  }

  pdf.save(`Livro_Diario_${periodText.replace(/[\/\\:\s]/g, "-")}.pdf`);
}

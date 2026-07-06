"use client";

import { Modal, ModalHeader, ModalFooter } from "@/ui/modals/Modal";
import { Button } from "@/ui/forms";
import { formatCurrency } from "@/utils/format";
import { Printer, FileDown } from "lucide-react";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface HoleriteModalProps {
  holerite: any;
  onClose: () => void;
}

export function HoleriteModal({ holerite, onClose }: HoleriteModalProps) {
  const holeriteRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const d = holerite.detalhes;
  
  // Linhas do holerite
  const linhas = [
    { desc: "Salário Base (Proporcional)", ref: `${d.diasTrabalhados} d`, vencimento: d.salarioBruto, desconto: 0 }
  ];

  if (d.inss > 0) {
    linhas.push({ desc: "INSS", ref: "", vencimento: 0, desconto: d.inss });
  }
  if (d.irrf > 0) {
    linhas.push({ desc: "IRRF", ref: "", vencimento: 0, desconto: d.irrf });
  }
  if (d.vtDesconto > 0) {
    linhas.push({ desc: "Vale Transporte", ref: "", vencimento: 0, desconto: d.vtDesconto });
  }
  if (d.vrDesconto > 0) {
    linhas.push({ desc: "Vale Refeição", ref: "", vencimento: 0, desconto: d.vrDesconto });
  }
  if (d.planoSaudeDesconto > 0) {
    linhas.push({ desc: "Plano de Saúde", ref: "", vencimento: 0, desconto: d.planoSaudeDesconto });
  }

  const mesStr = String(holerite.mes_referencia).padStart(2, '0');
  
  function handlePrint() {
    window.print();
  }

  function formatCnpj(cnpj?: string) {
    if (!cnpj) return "00.000.000/0001-00";
    const cleaned = cnpj.replace(/\D/g, "");
    if (cleaned.length !== 14) return cnpj;
    return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  }

  async function handleExportPDF() {
    if (!holeriteRef.current) return;
    try {
      setIsExporting(true);
      const canvas = await html2canvas(holeriteRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Margens
      const margin = 10;
      const finalWidth = pdfWidth - margin * 2;
      const finalHeight = (canvas.height * finalWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", margin, margin, finalWidth, finalHeight);
      pdf.save(`Holerite_${holerite.funcionarios?.nome?.replace(/\s+/g, '_')}_${mesStr}_${holerite.ano_referencia}.pdf`);
    } catch (err) {
      console.error("Erro ao exportar PDF", err);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <Modal open onClose={onClose} maxWidth="800px">
      <ModalHeader
        eyebrow="Recurso Humanos"
        title="Recibo de Pagamento de Salário"
        onClose={onClose}
      />

      <div ref={holeriteRef} className="p-6 font-sans print:p-0" style={{ backgroundColor: "#fff", color: "#000" }}>
        
        {/* Cabeçalho */}
        <div className="border p-3 mb-2 flex justify-between items-center" style={{ borderColor: "#000" }}>
          <div>
            <h2 className="font-bold text-lg uppercase">{holerite.empresas?.razao_social || "Sua Empresa LTDA"}</h2>
            <p className="text-xs">CNPJ: {formatCnpj(holerite.empresas?.cnpj)}</p>
          </div>
          <div className="text-right">
            <h3 className="font-bold text-md uppercase">Recibo de Pagamento de Salário</h3>
            <p className="text-sm font-semibold">Referência: {mesStr}/{holerite.ano_referencia}</p>
          </div>
        </div>

        {/* Dados do Funcionario */}
        <div className="border p-3 mb-4 flex justify-between" style={{ borderColor: "#000" }}>
          <div>
            <p className="text-xs uppercase" style={{ color: "#4b5563" }}>Código - Nome do Funcionário</p>
            <p className="font-bold text-sm uppercase">00{holerite.funcionario_id.substring(0,4)} - {holerite.funcionarios?.nome}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase" style={{ color: "#4b5563" }}>Cargo</p>
            <p className="font-bold text-sm uppercase">{holerite.funcionarios?.cargo}</p>
          </div>
        </div>

        {/* Tabela de Vencimentos e Descontos */}
        <table className="w-full border-collapse border text-sm mb-4" style={{ borderColor: "#000" }}>
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6" }}>
              <th className="border py-1 px-2 text-left" style={{ borderColor: "#000" }}>Descrição</th>
              <th className="border py-1 px-2 text-center w-24" style={{ borderColor: "#000" }}>Referência</th>
              <th className="border py-1 px-2 text-right w-32" style={{ borderColor: "#000" }}>Vencimentos</th>
              <th className="border py-1 px-2 text-right w-32" style={{ borderColor: "#000" }}>Descontos</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l, i) => (
              <tr key={i}>
                <td className="border-l border-r py-1 px-2" style={{ borderColor: "#000" }}>{l.desc}</td>
                <td className="border-l border-r py-1 px-2 text-center" style={{ borderColor: "#000" }}>{l.ref}</td>
                <td className="border-l border-r py-1 px-2 text-right" style={{ borderColor: "#000" }}>
                  {l.vencimento > 0 ? formatCurrency(l.vencimento) : ""}
                </td>
                <td className="border-l border-r py-1 px-2 text-right" style={{ borderColor: "#000" }}>
                  {l.desconto > 0 ? formatCurrency(l.desconto) : ""}
                </td>
              </tr>
            ))}
            {/* Linhas vazias para preencher o holerite */}
            {Array.from({ length: Math.max(0, 10 - linhas.length) }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td className="border-l border-r py-1 px-2" style={{ borderColor: "#000" }}>&nbsp;</td>
                <td className="border-l border-r py-1 px-2" style={{ borderColor: "#000" }}>&nbsp;</td>
                <td className="border-l border-r py-1 px-2" style={{ borderColor: "#000" }}>&nbsp;</td>
                <td className="border-l border-r py-1 px-2" style={{ borderColor: "#000" }}>&nbsp;</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t" style={{ borderColor: "#000" }}>
              <td colSpan={2} className="border p-2 font-bold text-right" style={{ borderColor: "#000" }}>Totais:</td>
              <td className="border p-2 font-bold text-right" style={{ borderColor: "#000" }}>{formatCurrency(holerite.salario_bruto)}</td>
              <td className="border p-2 font-bold text-right" style={{ borderColor: "#000", color: "#dc2626" }}>{formatCurrency(holerite.total_descontos)}</td>
            </tr>
          </tfoot>
        </table>

        {/* Rodapé e Resumo */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 border p-2" style={{ borderColor: "#000", backgroundColor: "#f9fafb" }}>
            <p className="text-xs uppercase text-center mb-1" style={{ color: "#4b5563" }}>Líquido a Receber</p>
            <p className="font-bold text-lg text-center">{formatCurrency(holerite.salario_liquido)}</p>
          </div>
          <div className="flex-[2] border p-2 text-xs flex justify-between text-center" style={{ borderColor: "#000" }}>
            <div>
              <p className="uppercase mb-1" style={{ color: "#4b5563" }}>Salário Base</p>
              <p className="font-bold">{formatCurrency(d.salarioBruto)}</p>
            </div>
            <div>
              <p className="uppercase mb-1" style={{ color: "#4b5563" }}>Base Calc. INSS</p>
              <p className="font-bold">{formatCurrency(d.salarioBruto)}</p>
            </div>
            <div>
              <p className="uppercase mb-1" style={{ color: "#4b5563" }}>Base Calc. IRRF</p>
              <p className="font-bold">{formatCurrency(d.salarioBruto - d.inss)}</p>
            </div>
            <div>
              <p className="uppercase mb-1" style={{ color: "#4b5563" }}>FGTS do Mês</p>
              <p className="font-bold">{formatCurrency(d.salarioBruto * 0.08)}</p>
            </div>
          </div>
        </div>

        {/* Assinatura */}
        <div className="mt-8 pt-8 border-t w-3/4 mx-auto text-center" style={{ borderColor: "#000" }}>
          <p className="text-sm font-semibold">Assinatura do Funcionário</p>
          <p className="text-xs mt-1" style={{ color: "#6b7280" }}>Declaro ter recebido a importância líquida discriminada neste recibo.</p>
        </div>
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={isExporting}>Fechar</Button>
        <div className="flex gap-2">
          <Button onClick={handleExportPDF} disabled={isExporting} className="bg-[#4edea3] text-[#003824] hover:bg-[#43cd96]">
            <FileDown size={16} /> {isExporting ? "Gerando..." : "Exportar PDF"}
          </Button>
          <Button onClick={handlePrint} disabled={isExporting}>
            <Printer size={16} /> Imprimir
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

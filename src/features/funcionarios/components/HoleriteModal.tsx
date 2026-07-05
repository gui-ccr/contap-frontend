"use client";

import { Modal, ModalHeader, ModalFooter } from "@/ui/Modal";
import { Button } from "@/ui/forms";
import { formatCurrency } from "@/utils/format";
import { Printer } from "lucide-react";

interface HoleriteModalProps {
  holerite: any;
  onClose: () => void;
}

export function HoleriteModal({ holerite, onClose }: HoleriteModalProps) {
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

  return (
    <Modal open onClose={onClose} maxWidth="800px">
      <ModalHeader
        eyebrow="Recurso Humanos"
        title="Recibo de Pagamento de Salário"
        onClose={onClose}
      />

      <div className="p-6 bg-white text-black font-sans print:p-0">
        
        {/* Cabeçalho */}
        <div className="border border-black p-3 mb-2 flex justify-between items-center">
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
        <div className="border border-black p-3 mb-4 flex justify-between">
          <div>
            <p className="text-xs uppercase text-gray-600">Código - Nome do Funcionário</p>
            <p className="font-bold text-sm uppercase">00{holerite.funcionario_id.substring(0,4)} - {holerite.funcionarios?.nome}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase text-gray-600">Cargo</p>
            <p className="font-bold text-sm uppercase">{holerite.funcionarios?.cargo}</p>
          </div>
        </div>

        {/* Tabela de Vencimentos e Descontos */}
        <table className="w-full border-collapse border border-black text-sm mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black py-1 px-2 text-left">Descrição</th>
              <th className="border border-black py-1 px-2 text-center w-24">Referência</th>
              <th className="border border-black py-1 px-2 text-right w-32">Vencimentos</th>
              <th className="border border-black py-1 px-2 text-right w-32">Descontos</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l, i) => (
              <tr key={i}>
                <td className="border-l border-r border-black py-1 px-2">{l.desc}</td>
                <td className="border-l border-r border-black py-1 px-2 text-center">{l.ref}</td>
                <td className="border-l border-r border-black py-1 px-2 text-right">
                  {l.vencimento > 0 ? formatCurrency(l.vencimento) : ""}
                </td>
                <td className="border-l border-r border-black py-1 px-2 text-right">
                  {l.desconto > 0 ? formatCurrency(l.desconto) : ""}
                </td>
              </tr>
            ))}
            {/* Linhas vazias para preencher o holerite */}
            {Array.from({ length: Math.max(0, 10 - linhas.length) }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td className="border-l border-r border-black py-1 px-2">&nbsp;</td>
                <td className="border-l border-r border-black py-1 px-2">&nbsp;</td>
                <td className="border-l border-r border-black py-1 px-2">&nbsp;</td>
                <td className="border-l border-r border-black py-1 px-2">&nbsp;</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-black">
              <td colSpan={2} className="border border-black p-2 font-bold text-right">Totais:</td>
              <td className="border border-black p-2 font-bold text-right">{formatCurrency(holerite.salario_bruto)}</td>
              <td className="border border-black p-2 font-bold text-right text-red-600">{formatCurrency(holerite.total_descontos)}</td>
            </tr>
          </tfoot>
        </table>

        {/* Rodapé e Resumo */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 border border-black p-2 bg-gray-50">
            <p className="text-xs uppercase text-gray-600 text-center mb-1">Líquido a Receber</p>
            <p className="font-bold text-lg text-center">{formatCurrency(holerite.salario_liquido)}</p>
          </div>
          <div className="flex-[2] border border-black p-2 text-xs flex justify-between text-center">
            <div>
              <p className="uppercase text-gray-600 mb-1">Salário Base</p>
              <p className="font-bold">{formatCurrency(d.salarioBruto)}</p>
            </div>
            <div>
              <p className="uppercase text-gray-600 mb-1">Base Calc. INSS</p>
              <p className="font-bold">{formatCurrency(d.salarioBruto)}</p>
            </div>
            <div>
              <p className="uppercase text-gray-600 mb-1">Base Calc. IRRF</p>
              <p className="font-bold">{formatCurrency(d.salarioBruto - d.inss)}</p>
            </div>
            <div>
              <p className="uppercase text-gray-600 mb-1">FGTS do Mês</p>
              <p className="font-bold">{formatCurrency(d.salarioBruto * 0.08)}</p>
            </div>
          </div>
        </div>

        {/* Assinatura */}
        <div className="mt-8 pt-8 border-t border-black w-3/4 mx-auto text-center">
          <p className="text-sm font-semibold">Assinatura do Funcionário</p>
          <p className="text-xs text-gray-500 mt-1">Declaro ter recebido a importância líquida discriminada neste recibo.</p>
        </div>
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Fechar</Button>
        <Button onClick={handlePrint}>
          <Printer size={16} /> Imprimir Holerite
        </Button>
      </ModalFooter>
    </Modal>
  );
}

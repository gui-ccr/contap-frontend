import { IConfigFolha } from "../components/NovoFuncionarioModal";

export interface Funcionario {
  id: string;
  nome: string;
  cpf_cnpj: string;
  salario: number;
  dia_pagamento?: number;
  data_admissao: string;
  cargo: string;
  email: string;
  iniciais: string;
  cor: string;
  ativo: boolean;
  foto_url?: string;
  config_folha?: IConfigFolha;
}

export interface FuncionarioBackend {
  id: string;
  nome: string;
  cpf_cnpj: string;
  salario: number;
  dia_pagamento?: number;
  data_admissao?: string;
  cargo: string;
  email: string;
  foto_url?: string;
  config_folha?: IConfigFolha;
}

export interface CriarFuncionarioPayload {
  nome: string;
  email?: string;
  cpf_cnpj: string;
  salario: number;
  dia_pagamento?: number;
  data_admissao?: string;
  cargo: string;
  foto_url?: string | null;
  config_folha?: IConfigFolha;
}

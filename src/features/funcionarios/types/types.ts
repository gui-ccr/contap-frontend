export interface Funcionario {
  id: string;
  nome: string;
  cpf_cnpj: string;
  salario: number;
  dia_pagamento: number;
  cargo: string;
  email: string;
  iniciais: string;
  cor: string;
  ativo: boolean;
  foto_url?: string;
}

export interface FuncionarioBackend {
  id: string;
  nome: string;
  cpf_cnpj: string;
  salario: number;
  dia_pagamento: number;
  cargo: string;
  email: string;
  foto_url?: string;
}

export interface CriarFuncionarioPayload {
  nome: string;
  email?: string;
  cpf_cnpj: string;
  salario: number;
  dia_pagamento: number;
  cargo: string;
  foto_url?: string | null;
}

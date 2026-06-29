export interface Funcionario {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  cargo: "GERENTE" | "CAIXA" | "DONO";
  foto?: string;
  iniciais: string;
  cor: string;
  ativo: boolean;
}

export interface FuncionarioBackend {
  id: string;
  nome: string;
  email: string;
  empresa_id: string;
  cargo: "GERENTE" | "CAIXA" | "DONO";
  cpf?: string;
  data_nascimento?: string;
  foto_url?: string;
}

export interface CriarFuncionarioPayload {
  nome: string;
  email: string;
  senha: string;
  empresa_id: string;
  cargo: "GERENTE" | "CAIXA";
  cpf?: string;
  data_nascimento?: string;
  foto_url?: string;
}

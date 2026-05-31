export interface Funcionario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  cargo: string;
  foto?: string;
  iniciais: string;
  cor: string;
  ativo: boolean;
}

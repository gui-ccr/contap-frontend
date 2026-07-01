export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: "DONO" | "GERENTE" | "CAIXA";
  ativo: boolean;
  iniciais: string;
  cor: string;
}

export interface UsuarioBackend {
  id: string;
  nome: string;
  email: string;
  cargo: "DONO" | "GERENTE" | "CAIXA";
  ativo?: boolean;
}

export interface CriarUsuarioPayload {
  nome: string;
  email: string;
  senha?: string;
  empresa_id: string;
  cargo: "GERENTE" | "CAIXA";
}

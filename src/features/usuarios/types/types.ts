// O cargo é um texto livre vindo da tabela de cargos do backend
// (não é mais o enum fixo DONO/GERENTE/CAIXA).
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  ativo: boolean;
  iniciais: string;
  cor: string;
  foto_url?: string;
}

export interface UsuarioBackend {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  ativo?: boolean;
  foto_url?: string;
}

export interface CriarUsuarioPayload {
  nome: string;
  email: string;
  senha?: string;
  empresa_id: string;
  cargo: string;
  ativo?: boolean;
  foto_url?: string | null;
}

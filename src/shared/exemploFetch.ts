/**
 * Exemplo de estrutura de integração com a API ContaUp utilizando o padrão fetch do JavaScript.
 * Este arquivo serve como referência para o fluxo de onboarding e chamadas autenticadas.
 */

const BASE_URL = "https://contup-api.vercel.app/";

// Interfaces para os tipos de dados da API ContaUp
export interface RegistroDonoPayload {
  nome: string;
  email: string;
  senha?: string;
}

export interface LoginPayload {
  email: string;
  senha?: string;
}

export interface EmpresaPayload {
  nome: string;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
}

export interface APIErrorResponse {
  status: "error";
  code: string;
  message: string;
}

export interface LoginSuccessResponse {
  status: "success";
  data: {
    token: string;
    usuario: {
      id: string;
      nome: string;
      email: string;
    };
  };
}

export interface RegistroDonoSuccessResponse {
  status: "success";
  message: string;
}

export interface EmpresaSuccessResponse {
  status: "success";
  message: string;
  data: {
    id: string;
    nome: string;
    nome_fantasia: string;
    razao_social: string;
    cnpj: string;
    plano_contas_padrao?: any[];
  };
}

/**
 * Função utilitária para tratar as respostas da API e converter erros do formato padrão da ContaUp.
 */
async function processarResposta<T>(response: Response): Promise<T> {
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  // Se o status HTTP não estiver na faixa de sucesso (200-299)
  if (!response.ok) {
    if (data && data.status === "error") {
      // Cria um erro customizado com as informações enviadas pela API
      const error = new Error(data.message || "Erro na requisição.");
      (error as any).code = data.code;
      (error as any).status = data.status;
      throw error;
    }
    throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
  }

  // Se a API retornar um objeto com status "error" mesmo com status HTTP de sucesso (caso ocorra)
  if (data && data.status === "error") {
    const error = new Error(data.message || "Erro retornado pela API.");
    (error as any).code = data.code;
    (error as any).status = data.status;
    throw error;
  }

  return data as T;
}

/**
 * 1. Registrar o Dono (POST /auth/registrar-dono)
 */
export async function registrarDono(dados: RegistroDonoPayload): Promise<RegistroDonoSuccessResponse> {
  try {
    const response = await fetch(`${BASE_URL}/auth/registrar-dono`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    return await processarResposta<RegistroDonoSuccessResponse>(response);
  } catch (error: any) {
    console.error("Erro no registro do dono:", error.message, error.code);
    throw error;
  }
}

/**
 * 2. Efetuar Login (POST /auth/login)
 */
export async function login(dados: LoginPayload): Promise<LoginSuccessResponse> {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    const resultado = await processarResposta<LoginSuccessResponse>(response);

    // 3. Capturar o token JWT recebido na resposta de sucesso
    const token = resultado.data.token;
    
    // Armazenar com segurança no localStorage (no lado do cliente)
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }

    return resultado;
  } catch (error: any) {
    console.error("Erro no login:", error.message, error.code);
    throw error;
  }
}

/**
 * Função auxiliar para obter o token armazenado
 */
export function obterToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

/**
 * 4. Criar a Empresa (POST /empresas) com o Header de Autorização
 */
export async function criarEmpresa(dados: EmpresaPayload): Promise<EmpresaSuccessResponse> {
  try {
    const token = obterToken();
    if (!token) {
      throw new Error("Token de autenticação não encontrado. Faça o login primeiro.");
    }

    const response = await fetch(`${BASE_URL}/empresas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Utilizando o token JWT no header de autorização
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
    });

    return await processarResposta<EmpresaSuccessResponse>(response);
  } catch (error: any) {
    console.error("Erro na criação da empresa:", error.message, error.code);
    throw error;
  }
}

/**
 * Fluxo Completo de Integração Inicial (Onboarding)
 * 1. Registrar Dono -> 2. Fazer Login -> 3. Armazenar Token -> 4. Criar Empresa
 */
export async function executarFluxoInicial(
  dadosDono: RegistroDonoPayload,
  dadosEmpresa: EmpresaPayload
): Promise<EmpresaSuccessResponse> {
  console.log("Iniciando fluxo de integração...");

  // Passo 1: Registro
  await registrarDono(dadosDono);
  console.log("Dono registrado com sucesso!");

  // Passo 2 & 3: Login e Armazenamento automático do Token
  await login({
    email: dadosDono.email,
    senha: dadosDono.senha,
  });
  console.log("Login efetuado e token armazenado com sucesso!");

  // Passo 4: Criação da Empresa
  const empresa = await criarEmpresa(dadosEmpresa);
  console.log("Empresa criada com sucesso!");

  return empresa;
}

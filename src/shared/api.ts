const BASE_URL = "https://contaup-api.vercel.app";

function getAuthHeaders(): Headers {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMessage = data?.error || data?.message || data?.details || "Ocorreu um erro na requisição.";
    throw new Error(errorMessage);
  }

  if (data && typeof data === 'object' && 'status' in data && data.status === "error") {
    throw new Error(data.message || data.error || "Ocorreu um erro na requisição.");
  }

  if (data && typeof data === 'object' && 'status' in data && 'data' in data && data.status === "success") {
    return data.data as T;
  }

  return data as T;
}

/**
 * Cliente API Padronizado (estilo Axios)
 * 
 * ATENÇÃO EQUIPE: Usem isso para implementar os próximos serviços (DRE, Funcionários, etc.)
 * 
 * Exemplo de implementação de um novo serviço:
 * 
 * import { apiClient } from "@/shared/api";
 * 
 * export const dreService = {
 *   obterResumo: () => apiClient.get("/dre/resumo", { ano: "2024" }),
 *   criar: (dados) => apiClient.post("/dre", dados),
 * };
 */
export const apiClient = {
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse<T>(response);
  },

  async post<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async put<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse<T>(response);
  }
};

export function getEmpresaIdFromToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.empresaId || null;
  } catch (err) {
    console.error("Erro ao decodificar token", err);
    return null;
  }
}

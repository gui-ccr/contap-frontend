const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://contaup-api.vercel.app";

import { getSupabaseClient } from "@/shared/supabaseClient";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    try {
      const supabase = getSupabaseClient();
      let { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        const localToken = localStorage.getItem("token");
        const localRefresh = localStorage.getItem("refresh_token");
        if (localToken && localRefresh) {
          const { data } = await supabase.auth.setSession({
            access_token: localToken,
            refresh_token: localRefresh
          });
          session = data.session;
        }
      }

      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
        localStorage.setItem("token", session.access_token);
        if (session.refresh_token) localStorage.setItem("refresh_token", session.refresh_token);
        return headers;
      }
    } catch (err) {
      console.warn("Erro ao obter sessao supabase:", err);
    }

    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
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
      headers: await getAuthHeaders(),
    });
    return handleResponse<T>(response);
  },

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: await getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });
    return handleResponse<T>(response);
  }
};

export function getEmpresaIdFromToken(): string | null {
  if (typeof window === "undefined") return null;
  
  const storedEmpresaId = localStorage.getItem("empresaId");
  if (storedEmpresaId) return storedEmpresaId;
  
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

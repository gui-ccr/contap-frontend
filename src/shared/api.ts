import axios, { AxiosError } from "axios";
import { getSupabaseClient } from "@/shared/supabaseClient";

let BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://contaup-api.vercel.app";

if (typeof window !== "undefined") {
  // Se estivermos em um ambiente de produção real (domínio público)
  // E a BASE_URL tiver sido gerada incorretamente apontando para localhost, forçamos a API de produção
  if (
    !window.location.hostname.includes("localhost") && 
    !window.location.hostname.includes("127.0.0.1") &&
    BASE_URL.includes("localhost")
  ) {
    BASE_URL = "https://contaup-api.vercel.app";
  }
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

axiosInstance.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    try {
      // O SDK do Supabase é a única fonte de verdade da sessão:
      // getSession() já renova o access token expirado usando o refresh token
      // persistido. Nunca chamar setSession com tokens guardados manualmente —
      // refresh tokens são de uso único e reusar um antigo derruba a sessão.
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (err) {
      console.warn("Erro ao obter sessao supabase:", err);
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data && typeof data === 'object' && 'status' in data && data.status === "error") {
      throw new Error(data.message || data.error || "Ocorreu um erro na requisição.");
    }
    if (data && typeof data === 'object' && 'status' in data && 'data' in data && data.status === "success") {
      return data.data;
    }
    return data;
  },
  (error: AxiosError) => {
    const data = error.response?.data as any;
    const errorMessage = data?.error || data?.message || data?.details || error.message || "Ocorreu um erro na requisição.";
    return Promise.reject(new Error(errorMessage));
  }
);

export const apiClient = {
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return await axiosInstance.get<any, T>(endpoint, { params });
  },

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return await axiosInstance.post<any, T>(endpoint, body);
  },

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return await axiosInstance.put<any, T>(endpoint, body);
  },

  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return await axiosInstance.patch<any, T>(endpoint, body);
  },

  async delete<T>(endpoint: string): Promise<T> {
    return await axiosInstance.delete<any, T>(endpoint);
  }
};

export function getEmpresaIdFromToken(): string | null {
  if (typeof window === "undefined") return null;

  const storedEmpresaId = localStorage.getItem("empresaId");
  if (storedEmpresaId) return storedEmpresaId;

  try {
    // Sessão persistida pelo SDK do Supabase (ver storageKey em supabaseClient.ts)
    const raw = localStorage.getItem("contaup-auth");
    if (!raw) return null;
    const session = JSON.parse(raw);
    const token: string | undefined = session?.access_token;
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.empresaId || payload.user_metadata?.empresa_id || null;
  } catch (err) {
    console.error("Erro ao decodificar token", err);
    return null;
  }
}

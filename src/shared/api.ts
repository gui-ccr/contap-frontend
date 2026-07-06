import axios, { AxiosError } from "axios";
import { getSupabaseClient } from "@/shared/supabaseClient";

let BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://nginx-production-6d15.up.railway.app";

if (typeof window !== "undefined") {
  // Se estivermos em um ambiente de produção real (domínio público)
  // E a BASE_URL tiver sido gerada incorretamente apontando para localhost, forçamos a API de produção
  if (
    !window.location.hostname.includes("localhost") && 
    !window.location.hostname.includes("127.0.0.1") &&
    BASE_URL.includes("localhost")
  ) {
    BASE_URL = "https://nginx-production-6d15.up.railway.app";
  }
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  }
});

const AUTH_EXEMPT_ENDPOINTS = ["/auth/login", "/auth/registrar-dono"];

axiosInstance.interceptors.request.use(async (config) => {
  const isExempt = AUTH_EXEMPT_ENDPOINTS.some((endpoint) => config.url?.startsWith(endpoint));
  if (isExempt) {
    return config;
  }

  if (typeof window !== "undefined") {
    // O SDK do Supabase é a única fonte de verdade da sessão:
    // getSession() já renova o access token expirado usando o refresh token
    // persistido. Nunca chamar setSession com tokens guardados manualmente —
    // refresh tokens são de uso único e reusar um antigo derruba a sessão.
    const supabase = getSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      // Fail-closed: sem sessão válida, não deixa a requisição seguir sem
      // Authorization (isso só produzia um 401 confuso vindo do backend).
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(new Error("Sessão expirada. Faça login novamente."));
    }

    config.headers.Authorization = `Bearer ${session.access_token}`;
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
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const supabase = getSupabaseClient();
      void supabase.auth.signOut().finally(() => {
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      });
      return Promise.reject(new Error("Sessão expirada. Faça login novamente."));
    }

    const data = error.response?.data as Record<string, unknown> | undefined;
    const errorMessage = typeof data === "object" && data !== null
      ? (data.error || data.message || data.details || error.message)
      : error.message || "Ocorreu um erro na requisição.";
    return Promise.reject(new Error(String(errorMessage)));
  }
);

export const apiClient = {
  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    return await axiosInstance.get<unknown, T>(endpoint, { params });
  },

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return await axiosInstance.post<unknown, T>(endpoint, body);
  },

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return await axiosInstance.put<unknown, T>(endpoint, body);
  },

  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return await axiosInstance.patch<unknown, T>(endpoint, body);
  },

  async delete<T>(endpoint: string): Promise<T> {
    return await axiosInstance.delete<unknown, T>(endpoint);
  }
};

export function getEmpresaIdFromToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    // Sessão persistida pelo SDK do Supabase (ver storageKey em supabaseClient.ts)
    const raw = localStorage.getItem("contaup-auth");
    if (!raw) return null;
    const session = JSON.parse(raw);
    const token: string | undefined = session?.access_token;
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.empresaId || payload.user_metadata?.empresa_id || payload.app_metadata?.empresa_id || null;
  } catch (err) {
    console.error("Erro ao decodificar token", err);
    return null;
  }
}

import axios, { AxiosError } from "axios";
import { getSupabaseClient } from "@/shared/supabaseClient";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://contaup-api.vercel.app";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

axiosInstance.interceptors.request.use(async (config) => {
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
        config.headers.Authorization = `Bearer ${session.access_token}`;
        localStorage.setItem("token", session.access_token);
        if (session.refresh_token) localStorage.setItem("refresh_token", session.refresh_token);
        return config;
      }
    } catch (err) {
      console.warn("Erro ao obter sessao supabase:", err);
    }

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

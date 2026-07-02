"use client";

import React, { createContext, useContext } from "react";
import { apiClient } from "./api";
import { usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface IUsuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  foto_url?: string;
  cpf?: string;
  data_nascimento?: string;
}

export interface IEmpresa {
  id: string;
  nome: string;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
}

interface IAuthContextData {
  usuario: IUsuario | null;
  empresa: IEmpresa | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);
const AUTH_ROUTES = ["/", "/login", "/cadastro-empresa", "/recuperar-senha", "/lgpd", "/landing"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const isPublicRoute = AUTH_ROUTES.includes(pathname);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["auth-me"],
    queryFn: async () => {
      const response = await apiClient.get<{ usuario: IUsuario; empresa: IEmpresa }>("/auth/me");
      return response;
    },
    enabled: !isPublicRoute,
    retry: false,
  });

  const refreshUserData = async () => {
    await refetch();
  };

  return (
    <AuthContext.Provider 
      value={{ 
        usuario: data?.usuario ?? null, 
        empresa: data?.empresa ?? null, 
        loading: isPublicRoute ? false : isLoading, 
        refreshUserData 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

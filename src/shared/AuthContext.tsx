"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "./api";
import { usePathname } from "next/navigation";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<IUsuario | null>(null);
  const [empresa, setEmpresa] = useState<IEmpresa | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const refreshUserData = async () => {
    // Não busca dados se estiver em rotas públicas para não gerar erro 401
    const AUTH_ROUTES = ["/", "/login", "/cadastro-empresa", "/recuperar-senha", "/lgpd", "/landing"];
    if (AUTH_ROUTES.includes(pathname)) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.get<{ data: { usuario: IUsuario; empresa: IEmpresa } }>("/auth/me");
      if (response.data) {
        setUsuario(response.data.usuario);
        setEmpresa(response.data.empresa);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, [pathname]); // Recarrega sempre que mudar de rota caso precise

  return (
    <AuthContext.Provider value={{ usuario, empresa, loading, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

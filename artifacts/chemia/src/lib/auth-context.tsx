import React, { createContext, useContext, useEffect, useState } from "react";
import { useGetMe, User } from "@workspace/api-client-react";
import { useLocation } from "wouter";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("chemia_token"));
  const [, setLocation] = useLocation();

  const { data: user, isLoading, error, refetch } = useGetMe({
    query: {
      enabled: !!token,
      retry: false,
    },
  });

  useEffect(() => {
    if (error) {
      // Token might be invalid
      localStorage.removeItem("chemia_token");
      setToken(null);
    }
  }, [error]);

  const login = (newToken: string) => {
    localStorage.setItem("chemia_token", newToken);
    setToken(newToken);
    refetch();
  };

  const logout = () => {
    localStorage.removeItem("chemia_token");
    setToken(null);
    setLocation("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading: token ? isLoading : false,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

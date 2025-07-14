"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { UnauthorizedError } from "infra/errors";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/v1/sessions/me");
        if (response.status === 200) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Falha ao buscar dados do usuário", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  const login = async (formData) => {
    const response = await fetch("/api/v1/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    if (response.status !== 201) {
      throw new UnauthorizedError({
        message: "E-mail incorreto e/ou senha incorreta.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }

    if (response.status === 201) {
      const userData = await fetch("/api/v1/sessions/me").then((res) =>
        res.json(),
      );
      setUser(userData);
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha no login");
    }
  };

  const logout = async () => {
    await fetch("/api/v1/sessions", { method: "DELETE" });
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

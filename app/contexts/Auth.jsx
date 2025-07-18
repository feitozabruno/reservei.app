"use client";
import { createContext, useContext } from "react";
import useSWR, { mutate } from "swr";

const fetcher = async (url) => {
  const response = await fetch(url);
  const responseBody = await response.json();

  if (!response.ok) {
    throw { ...responseBody };
  }

  return responseBody;
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data, error, isLoading } = useSWR("/api/v1/sessions/me", fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });

  const login = async (email, password) => {
    const response = await fetch("/api/v1/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const responseBody = await response.json();

    if (!response.ok) {
      throw { ...responseBody };
    }

    mutate("/api/v1/sessions/me");
    return;
  };

  const logout = async () => {
    mutate("/api/v1/sessions/me", null, false);
    await fetch("/api/v1/sessions", { method: "DELETE" });
  };

  const signup = async (email, password) => {
    const response = await fetch("/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw { ...errorData };
    }

    return;
  };

  const value = {
    user: error ? null : data,
    isLoading,
    error,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

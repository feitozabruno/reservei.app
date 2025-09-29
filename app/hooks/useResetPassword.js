"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const newPassword = formData.get("password");
    const confirmPassword = formData.get("confirm-password");
    const token = searchParams.get("token");

    if (!token) {
      setError("Token de redefinição não encontrado na URL.");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/v1/password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Ocorreu um erro ao redefinir a senha.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/entrar");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, success, handleSubmit };
}

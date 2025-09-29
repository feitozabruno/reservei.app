"use client";
import { useState } from "react";

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const requestPasswordReset = async (email) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await fetch("/api/v1/password/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.message + " " + errorData?.action ||
            "Ocorreu um erro ao enviar o email.",
        );
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err.message || "Ocorreu um erro ao enviar o email.");
    } finally {
      setIsLoading(false);
    }
  };

  return { requestPasswordReset, isLoading, error, isSuccess };
}

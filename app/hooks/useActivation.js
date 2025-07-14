"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NotFoundError } from "infra/errors.js";

export function useActivation(token) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const activeAccount = async () => {
      if (!token) {
        setIsLoading(false);
        setError("Token não encontrado na URL.");
        return;
      }

      try {
        const response = await fetch("/api/v1/activation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tokenId: token }),
        });

        if (response.status !== 200) {
          const errorData = await response.json();
          throw new NotFoundError({
            message: errorData.message || "Erro ao ativar conta.",
            action: errorData.action || "Tente novamente mais tarde.",
          });
        }

        setSuccess(true);

        setTimeout(() => {
          router.push("/escolher-perfil");
        }, 3000);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    activeAccount();
  }, [token, router]);

  return { isLoading, error, success };
}

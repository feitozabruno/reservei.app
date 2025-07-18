"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

      const response = await fetch("/api/v1/activation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokenId: token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setSuccess(true);

      setTimeout(() => {
        router.push("/escolher-perfil");
      }, 3000);
    };

    activeAccount();
  }, [token, router]);

  return { isLoading, error, success };
}

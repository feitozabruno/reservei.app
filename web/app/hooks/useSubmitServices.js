"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

export function toCreateServiceDtos(services) {
  return services.map((service) => ({
    name: service.name,
    description: service.description,
    price: Number(String(service.price).replace(",", ".")),
    durationMinutes: Number(service.duration),
  }));
}

export function useSubmitServices() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const submit = async (services) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = toCreateServiceDtos(services);

      await apiFetch("/services/batch", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success("Serviços salvos com sucesso.");

      const body = await apiFetch("/professionals/me", {
        method: "GET",
      });

      const me = await body.json();

      router.push(`/@${me.username}`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : (err?.detail ?? "Erro desconhecido");
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, error };
}

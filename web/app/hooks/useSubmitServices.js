"use client";

import { useState } from "react";
import { toast } from "sonner";

export function toCreateServiceDtos(services) {
  return services.map((service) => ({
    name: service.name,
    description: service.description,
    price: Number(String(service.price).replace(",", ".")),
    durationMinutes: Number(service.duration),
  }));
}

const API_URL = "http://localhost:5000";

export function useSubmitServices() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (services) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = toCreateServiceDtos(services);

      const response = await fetch(`${API_URL}/api/services/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const problem = await response.json().catch(() => null);
        throw new Error(
          problem?.detail ?? `Erro ao salvar (${response.status})`,
        );
      }

      toast.success("Serviços salvos com sucesso.");
      return await response.json().catch(() => null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, error };
}

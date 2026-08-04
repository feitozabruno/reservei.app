"use client";

import { useState } from "react";
import { toast } from "sonner";

export function toCreateAvailabilityDtos(workingDays) {
  return workingDays
    .filter((day) => day.enabled)
    .flatMap((day) =>
      day.blocks.map((block) => ({
        dayOfWeek: day.day,
        startTime: block.start,
        endTime: block.end,
      })),
    );
}

const API_URL = "http://localhost:5000";

export function useSubmitAvailability() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (workingDays) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = toCreateAvailabilityDtos(workingDays);

      const response = await fetch(`${API_URL}/api/availabilities`, {
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

      toast.success("Disponibilidades criadas com sucesso.");
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

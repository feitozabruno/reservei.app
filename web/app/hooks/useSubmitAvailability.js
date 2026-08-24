"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

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

export function useSubmitAvailability() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const submit = async (workingDays) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = toCreateAvailabilityDtos(workingDays);

      await apiFetch("/availabilities", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success("Disponibilidades criadas com sucesso.");

      router.push("/servicos");
    } catch (err) {
      toast.error(err.detail);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, error };
}

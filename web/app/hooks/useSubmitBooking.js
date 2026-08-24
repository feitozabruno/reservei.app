import { useState } from "react";
import { apiFetch } from "@/lib/api";

export function useSubmitBooking({
  Professional,
  service,
  selectedSlot,
  guestData,
  onSuccess,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);

  async function submitBooking() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const data = await apiFetch("/appointments", {
        method: "POST",
        body: JSON.stringify({
          professionalId: Professional.id,
          serviceId: service.id,
          clientName: guestData.name.trim(),
          clientEmail: guestData.email.trim(),
          clientPhone: guestData.phone.trim(),
          startTime: selectedSlot,
        }),
      });

      setBookingResult(data);
      onSuccess?.(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : (error?.detail ??
            "Não foi possível concluir o agendamento. Tente novamente.");
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetSubmitState() {
    setSubmitError(null);
    setBookingResult(null);
  }

  return {
    submitBooking,
    isSubmitting,
    submitError,
    bookingResult,
    resetSubmitState,
  };
}

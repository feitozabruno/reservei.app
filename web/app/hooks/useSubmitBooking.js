import { useState } from "react";

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
      const response = await fetch(`http://localhost:5000/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalId: Professional.id,
          serviceId: service.id,
          clientName: guestData.name.trim(),
          clientEmail: guestData.email.trim(),
          clientPhone: guestData.phone.trim(),
          startTime: selectedSlot,
        }),
      });

      if (!response.ok) {
        const problem = await response.json().catch(() => null);
        throw new Error(
          problem?.detail ?? "Não foi possível concluir o agendamento.",
        );
      }

      const data = await response.json();
      setBookingResult(data);
      onSuccess?.(data);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Não foi possível concluir o agendamento. Tente novamente.",
      );
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

"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { fromZonedTime, toZonedTime, formatInTimeZone } from "date-fns-tz";

const fetcher = (url) => fetch(url).then((res) => res.json());

async function createAppointment(url, { arg }) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorInfo = await response.json();
    const error = new Error(errorInfo.message || "Falha ao criar agendamento");
    error.info = errorInfo;
    throw error;
  }

  return response.json();
}

export default function useProfessionalSchedule(
  professionalId,
  professionalTimezone,
) {
  const [selectedDate, setSelectedDate] = useState(
    toZonedTime(new Date(), professionalTimezone),
  );
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [appointmentResult, setAppointmentResult] = useState(null);
  const [mutationError, setMutationError] = useState(null);

  const targetDate = formatInTimeZone(
    selectedDate,
    professionalTimezone,
    "yyyy-MM-dd",
  );

  const {
    data: availableSlots,
    error: fetchError,
    isLoading,
    mutate,
  } = useSWR(
    professionalId && professionalTimezone
      ? `/api/v1/professionals/${professionalId}/available-slots?date=${targetDate}`
      : null,
    fetcher,
  );

  const { trigger: triggerAppointment, isMutating } = useSWRMutation(
    "/api/v1/appointments",
    createAppointment,
    {
      onSuccess: (data) => {
        setAppointmentResult(data);
        setMutationError(null);
        mutate();
        setBookingStep(3);
      },
      onError: (error) => {
        console.error("Erro ao agendar:", error.message);
        setMutationError(error.message);
      },
    },
  );

  const handleConfirmAppointment = useCallback(async () => {
    if (!selectedSlot) return;
    setMutationError(null);
    const appointmentData = {
      professionalProfileId: professionalId,
      startTime: selectedSlot,
    };
    await triggerAppointment(appointmentData);
  }, [selectedSlot, professionalId, triggerAppointment]);

  const handlePreviousDay = useCallback(() => {
    const todayInProfessionalTz = toZonedTime(new Date(), professionalTimezone);
    todayInProfessionalTz.setHours(0, 0, 0, 0);

    const previousDay = new Date(selectedDate);
    previousDay.setDate(selectedDate.getDate() - 1);

    if (previousDay >= todayInProfessionalTz) {
      setSelectedDate(previousDay);
      setSelectedSlot(null);
    }
  }, [selectedDate, professionalTimezone]);

  const handleNextDay = useCallback(() => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);
    setSelectedDate(nextDay);
    setSelectedSlot(null);
  }, [selectedDate]);

  const resetBookingProcess = useCallback(() => {
    setBookingStep(1);
    setSelectedSlot(null);
    setAppointmentResult(null);
    setMutationError(null);
  }, []);

  const handleDateSelect = useCallback(
    (date) => {
      if (date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const dateAtMidnight = new Date(year, month, day);
        const utcDate = fromZonedTime(dateAtMidnight, professionalTimezone);

        setSelectedDate(utcDate);
        setSelectedSlot(null);
      }
    },
    [professionalTimezone],
  );

  const nextStep = useCallback(() => setBookingStep((prev) => prev + 1), []);
  const prevStep = useCallback(() => setBookingStep((prev) => prev - 1), []);

  const todayInProfessionalTz = toZonedTime(new Date(), professionalTimezone);
  todayInProfessionalTz.setHours(0, 0, 0, 0);
  const isPastDate = selectedDate < todayInProfessionalTz;

  return {
    availableSlots,
    isLoading,
    isMutating,
    fetchError,
    mutationError,
    selectedDate,
    selectedSlot,
    setSelectedSlot,
    bookingStep,
    handleDateSelect,
    handlePreviousDay,
    handleNextDay,
    handleConfirmAppointment,
    resetBookingProcess,
    appointmentResult,
    nextStep,
    prevStep,
    isPastDate,
  };
}

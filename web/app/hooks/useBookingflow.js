import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

const fetcher = (url) => fetch(url).then((res) => res.json());

const EMPTY_GUEST_DATA = { name: "", email: "", phone: "" };

export function useBookingFlow(Professional) {
  const services = Professional.services;
  const nowInProfessionalTz = toZonedTime(new Date(), Professional.timezone);
  const today = new Date(
    nowInProfessionalTz.getFullYear(),
    nowInProfessionalTz.getMonth(),
    nowInProfessionalTz.getDate(),
  );

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [service, setService] = useState(services[0]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [guestData, setGuestData] = useState(EMPTY_GUEST_DATA);

  const datePickerRef = useRef(null);

  const targetDate = format(selectedDate, "yyyy-MM-dd");
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const isPastDate = selectedDate <= startOfToday;

  function openBooking() {
    setStep(1);
    setIsOpen(true);
  }

  function closeBooking() {
    setIsOpen(false);
    setSelectedDate(today);
    setSelectedSlot(null);
    setGuestData(EMPTY_GUEST_DATA);
  }

  function goToPreviousStep() {
    setStep((prev) => prev - 1);
  }

  function goToNextStep() {
    setStep((prev) => prev + 1);
  }

  const handlePreviousDay = () => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(selectedDate.getDate() - 1);
    setSelectedDate(previousDay);
    setSelectedSlot(null);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);
    setSelectedDate(nextDay);
    setSelectedSlot(null);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
    setSelectedSlot(null);
  };

  const updateGuestField = (field, value) => {
    setGuestData((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (date) => {
    const formatted = format(new Date(date), "EEEE, d 'de' MMMM", {
      locale: ptBR,
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const formatSlotFull = (rawSlot) => {
    const formatted = format(
      new Date(rawSlot),
      "EEEE, d 'de' MMMM 'às' HH:mm",
      {
        timeZone: Professional.timezone,
        locale: ptBR,
      },
    );
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const formatSlot = (rawSlot) =>
    format(new Date(rawSlot), "HH:mm", { timeZone: Professional.timezone });

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setIsDatePickerOpen(false);
      }
    }
    if (isDatePickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDatePickerOpen]);

  const {
    data: availableSlots,
    error: fetchError,
    isLoading,
  } = useSWR(
    `http://localhost:5000/api/professionals/${Professional.id}/available-slots?serviceId=${service.id}&date=${targetDate}`,
    fetcher,
  );

  const isGuestDataValid =
    guestData.name.trim() !== "" &&
    guestData.email.trim() !== "" &&
    guestData.phone.trim() !== "";

  const canContinue =
    step === 1 ||
    (step === 2 && !!selectedSlot) ||
    (step === 3 && isGuestDataValid);

  return {
    services,
    isOpen,
    step,
    service,
    setService,
    isDatePickerOpen,
    setIsDatePickerOpen,
    selectedDate,
    selectedSlot,
    setSelectedSlot,
    guestData,
    updateGuestField,
    datePickerRef,
    isPastDate,
    startOfToday,
    openBooking,
    closeBooking,
    goToPreviousStep,
    goToNextStep,
    handlePreviousDay,
    handleNextDay,
    handleDateSelect,
    formatDate,
    formatSlotFull,
    formatSlot,
    availableSlots,
    fetchError,
    isLoading,
    canContinue,
  };
}

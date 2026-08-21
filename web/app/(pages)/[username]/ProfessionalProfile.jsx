/* eslint-disable @next/next/no-img-element */
"use client";

import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  MapPin,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useBookingFlow } from "@/hooks/useBookingflow";
import { useSubmitBooking } from "@/hooks/useSubmitBooking";

export function ProfessionalProfile({ Professional }) {
  const {
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
  } = useBookingFlow(Professional);

  const {
    submitBooking,
    isSubmitting,
    submitError,
    bookingResult,
    resetSubmitState,
  } = useSubmitBooking({
    Professional,
    service: service,
    selectedSlot: selectedSlot,
    guestData: guestData,
    onSuccess: () => goToNextStep(),
  });

  function handleClose() {
    closeBooking();
    resetSubmitState();
  }

  function handleContinue() {
    if (step === 3) {
      submitBooking();
    } else {
      goToNextStep();
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section>
        <header className="flex items-center justify-between">
          <a
            href="#inicio"
            aria-label="Voltar para início"
            className="flex size-10 items-center justify-center rounded-full border border-border bg-card transition hover:bg-muted"
          >
            <ChevronLeft className="size-5" />
          </a>
          <button
            aria-label="Favoritar profissional"
            className="flex size-10 items-center justify-center rounded-full border border-border bg-card transition hover:bg-muted"
          >
            <Heart className="size-5" />
          </button>
        </header>

        <div id="inicio" className="mx-auto w-full max-w-xl pt-10 lg:pt-20">
          <div className="flex items-center gap-4">
            <div className="size-20 overflow-hidden rounded-2xl bg-muted sm:size-24">
              <img
                src="https://github.com/feitozabruno.png"
                alt={Professional.fullName}
                className="size-full object-cover"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-primary">
                <ShieldCheck className="size-4" /> Perfil verificado
              </div>
              <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
                {Professional.fullName}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {Professional.specialty}
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Star className="size-4 fill-primary text-primary" />{" "}
              <strong className="text-foreground">4.9</strong> (86 avaliações)
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" /> {Professional.addressCity},{" "}
              {Professional.addressState}
            </span>
          </div>

          <button
            onClick={openBooking}
            className="mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            <CalendarDays className="size-5" /> Agendar um horário{" "}
            <ArrowRight className="size-4" />
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Você poderá escolher o melhor dia e horário
          </p>
        </div>
      </section>
      <>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 p-0 sm:items-center sm:p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
          >
            <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-card p-6 shadow-2xl sm:rounded-3xl sm:p-8">
              <div className="mb-7 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Agendamento · {step}/4
                  </p>
                  <h2 id="booking-title" className="mt-2 font-serif text-2xl">
                    {step === 1
                      ? "Escolha seu serviço"
                      : step === 2
                        ? "Escolha um horário"
                        : step === 3
                          ? "Seus dados"
                          : "Tudo certo por aqui"}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  aria-label="Fechar"
                  className="flex size-9 items-center justify-center rounded-full bg-muted"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="mb-8 flex gap-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className={`h-1 flex-1 rounded-full ${item <= step ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>

              {step === 1 && (
                <div className="flex flex-col gap-3">
                  {services.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setService(item)}
                      className={`rounded-2xl border p-4 text-left transition ${service.name === item.name ? "border-primary bg-accent" : "border-border hover:bg-muted"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="mt-1 text-sm leading-5 text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-semibold">
                          R$ {item.price}
                        </span>
                      </div>
                      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock3 className="size-3.5" /> {item.durationMinutes}{" "}
                        minutos
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePreviousDay}
                      disabled={isPastDate}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="relative" ref={datePickerRef}>
                      <div
                        className="cursor-pointer text-center"
                        role="button"
                        onClick={() => setIsDatePickerOpen((prev) => !prev)}
                      >
                        <p className="font-medium flex items-center gap-2">
                          <CalendarDays className="h-5 w-5" />
                          {formatDate(selectedDate)}
                        </p>
                      </div>

                      {isDatePickerOpen && (
                        <div className="absolute left-1/2 top-full z-50 mt-2 w-auto -translate-x-1/2 rounded-md border border-border bg-card p-0 shadow-lg">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            disabled={(date) => date < startOfToday}
                            initialFocus
                          />
                        </div>
                      )}
                    </div>

                    <Button variant="ghost" size="icon" onClick={handleNextDay}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="mb-3 mt-8 text-sm font-semibold">
                    Horários disponíveis
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {isLoading && <p>Carregando horários...</p>}
                    {fetchError && (
                      <p className="text-destructive">
                        Erro ao buscar horários.
                      </p>
                    )}
                    {availableSlots && availableSlots.length > 0
                      ? availableSlots.map((slot) => (
                          <Button
                            key={slot}
                            variant={
                              selectedSlot === slot ? "default" : "outline"
                            }
                            size="sm"
                            className="text-xs"
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {formatSlot(slot)}
                          </Button>
                        ))
                      : !isLoading && <p>Nenhum horário disponível.</p>}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <label
                      htmlFor="guest-name"
                      className="mb-1.5 block text-sm font-medium"
                    >
                      Nome completo
                    </label>
                    <input
                      id="guest-name"
                      type="text"
                      value={guestData.name}
                      onChange={(e) => updateGuestField("name", e.target.value)}
                      placeholder="Seu nome"
                      className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  {submitError && (
                    <p className="text-sm text-destructive">{submitError}</p>
                  )}
                  <div>
                    <label
                      htmlFor="guest-email"
                      className="mb-1.5 block text-sm font-medium"
                    >
                      E-mail
                    </label>
                    <input
                      id="guest-email"
                      type="email"
                      value={guestData.email}
                      onChange={(e) =>
                        updateGuestField("email", e.target.value)
                      }
                      placeholder="voce@email.com"
                      className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="guest-phone"
                      className="mb-1.5 block text-sm font-medium"
                    >
                      Telefone
                    </label>
                    <input
                      id="guest-phone"
                      type="tel"
                      value={guestData.phone}
                      onChange={(e) =>
                        updateGuestField("phone", e.target.value)
                      }
                      placeholder="(00) 00000-0000"
                      className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-col items-center text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-8" />
                  </div>
                  <p className="mt-5 text-sm leading-6 text-muted-foreground">
                    Sua sessão foi reservada com sucesso. Enviamos os detalhes
                    para o seu e-mail.
                  </p>
                  <div className="mt-6 w-full rounded-2xl bg-muted p-5 text-left">
                    <div className="flex justify-between gap-4">
                      <span className="text-sm text-muted-foreground">
                        Serviço
                      </span>
                      <span className="text-right text-sm font-semibold">
                        {service.name}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-between gap-4">
                      <span className="text-sm text-muted-foreground">
                        Data e horário
                      </span>
                      <span className="text-right text-sm font-semibold">
                        {formatSlotFull(selectedSlot)}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-between gap-4">
                      <span className="text-sm text-muted-foreground">
                        Profissional
                      </span>
                      <span className="text-right text-sm font-semibold">
                        {Professional.fullName}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-3">
                {step > 1 && step < 4 && (
                  <button
                    onClick={goToPreviousStep}
                    disabled={isSubmitting}
                    className="flex size-12 items-center justify-center rounded-full border border-border"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                )}
                {step < 4 ? (
                  <button
                    onClick={handleContinue}
                    disabled={!canContinue || isSubmitting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
                  >
                    {step === 3 && isSubmitting ? (
                      "Agendando..."
                    ) : (
                      <>
                        Continuar <ArrowRight className="size-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleClose}
                    className="flex-1 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground"
                  >
                    Fechar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    </main>
  );
}

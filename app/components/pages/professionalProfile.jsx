"use client";

import { useState } from "react";
import Image from "next/image";
import { ptBR } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import useProfessionalSchedule from "@/hooks/useProfessionalSchedule";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfessionalProfile({ professional }) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const {
    availableSlots,
    isLoading,
    isMutating,
    fetchError,
    mutationError,
    selectedDate,
    selectedSlot,
    setSelectedSlot,
    bookingStep,
    handlePreviousDay,
    handleNextDay,
    handleDateSelect,
    handleConfirmAppointment,
    resetBookingProcess,
    appointmentResult,
    nextStep,
    prevStep,
    isPastDate,
    todayInProfessionalTz,
    appointments,
    isLoadingAppointments,
    appointmentsError,
  } = useProfessionalSchedule(professional.id, professional.timezone);

  const formatDate = (date, formatString) => {
    const formatted = formatInTimeZone(
      date,
      professional.timezone,
      formatString,
      {
        locale: ptBR,
      },
    );
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const handleCreateAppointment = () => {
    resetBookingProcess();
    setIsBookingModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header com imagem de capa */}
      <div className="relative h-32 bg-gradient-to-r from-gray-800 to-gray-600">
        {professional.cover_picture_url && (
          <Image
            src={professional.cover_picture_url}
            alt="Capa do perfil"
            fill
            className="object-cover"
            priority
            quality={100}
          />
        )}
        <div className="absolute -bottom-16 left-6">
          <div className="relative">
            <Avatar className="border-background h-32 w-32 border-4 shadow-lg">
              <AvatarImage
                src={professional.profile_photo_url || undefined}
                alt={professional.full_name}
                className="object-cover"
              />
              <AvatarFallback className="text-4xl">
                {getInitials(professional.full_name)}
              </AvatarFallback>
            </Avatar>
            {professional && (
              <div className="border-background absolute right-2 bottom-2 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-green-500">
                <div className="h-2 w-2 rounded-full bg-white"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="space-y-6 px-6 pt-20 pb-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h1 className="text-foreground text-2xl font-bold">
              {professional.full_name}
            </h1>
            {professional && <CheckCircle className="h-5 w-5 text-blue-500" />}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {professional.specialty}
            </Badge>

            <span className="text-muted-foreground text-sm">
              <span className="text-muted-foreground text-sm"> • </span>{" "}
              {professional.business_name}{" "}
              <span className="text-muted-foreground text-sm"> • </span>
              <Badge
                variant="outline"
                className="border-green-600 text-green-600"
              >
                Ativo
              </Badge>
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button className="flex-1" onClick={handleCreateAppointment}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Agendar um horário
          </Button>
        </div>

        <Separator />

        {/* Biografia */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sobre</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {professional.bio}
            </p>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="text-muted-foreground h-4 w-4" />
              <span className="text-foreground">
                {professional.phone_number}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-muted-foreground h-4 w-4" />
              <span className="text-foreground">
                {professional.business_name}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Horários agendados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Agendamentos de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoadingAppointments && <p>Carregando agendamentos...</p>}
              {appointmentsError && (
                <p className="text-destructive">
                  Erro ao carregar agendamentos.
                </p>
              )}
              {appointments && appointments.length > 0
                ? appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="bg-secondary flex items-center justify-between rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <p className="text-sm font-medium">
                            {formatInTimeZone(
                              appointment.start_time,
                              professional.timezone,
                              "HH:mm",
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {appointment.client_name || "Cliente Agendado"}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Horário Reservado
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getStatusColor(appointment.status)}`}
                      >
                        {appointment.status === "SCHEDULED"
                          ? "Confirmado"
                          : "Pendente"}
                      </Badge>
                    </div>
                  ))
                : !isLoadingAppointments && (
                    <p className="text-muted-foreground text-sm">
                      Nenhum agendamento para hoje.
                    </p>
                  )}
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-blue-600">127</p>
              <p className="text-muted-foreground text-xs">Avaliações</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-green-600">98%</p>
              <p className="text-muted-foreground text-xs">Satisfação</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-purple-600">10+</p>
              <p className="text-muted-foreground text-xs">Anos</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Agendamento */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {bookingStep === 1 && "Selecione o Horário"}
              {bookingStep === 2 && "Confirmação de Agendamento"}
              {bookingStep === 3 && ""}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Step 1: Escolher */}
            {bookingStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePreviousDay}
                    disabled={isPastDate || isMutating}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Popover
                    open={isDatePickerOpen}
                    onOpenChange={setIsDatePickerOpen}
                  >
                    <PopoverTrigger asChild>
                      <div className="cursor-pointer text-center" role="button">
                        <p className="font-medium">
                          {formatDate(selectedDate, "EEEE, d 'de' MMMM")}
                        </p>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          handleDateSelect(date);
                          setIsDatePickerOpen(false);
                        }}
                        disabled={(date) => date < todayInProfessionalTz}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextDay}
                    disabled={isMutating}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex min-h-[320px] flex-col justify-between">
                  <div className="flex-grow">
                    <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                      Horários Disponíveis
                    </h4>
                    <div
                      className={`grid ${availableSlots && availableSlots.length > 0 ? "grid-cols-3" : ""} gap-2`}
                    >
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
                              variant={`${selectedSlot === slot ? "default" : "outline"}`}
                              size="sm"
                              className="text-xs"
                              onClick={() => setSelectedSlot(slot)}
                              disabled={isMutating}
                            >
                              {formatInTimeZone(
                                slot,
                                professional.timezone,
                                "HH:mm",
                              )}
                            </Button>
                          ))
                        : !isLoading && <p>Nenhum horário disponível.</p>}
                    </div>
                  </div>
                  <div className="mt-auto flex gap-3 pt-4">
                    <Button
                      onClick={nextStep}
                      disabled={!selectedSlot || isMutating}
                      className="flex-1"
                    >
                      Continuar
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Confirmar */}
            {bookingStep === 2 && selectedSlot && (
              <div className="space-y-4">
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="text-muted-foreground h-5 w-5" />
                    <div>
                      <p className="font-medium">Data</p>
                      <p className="text-muted-foreground text-sm capitalize">
                        {formatDate(selectedDate, "EEEE, d 'de' MMMM")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="text-muted-foreground h-5 w-5" />
                    <div>
                      <p className="font-medium">Horário</p>
                      <p className="text-muted-foreground text-sm">
                        {formatInTimeZone(
                          selectedSlot,
                          professional.timezone,
                          "HH:mm",
                        )}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <User className="text-muted-foreground h-5 w-5" />
                    <div>
                      <p className="font-medium">Profissional</p>
                      <p className="text-muted-foreground text-sm">
                        {professional.full_name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1"
                    disabled={isMutating}
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handleConfirmAppointment}
                    className="flex-1"
                    disabled={isMutating}
                  >
                    {isMutating ? "Confirmando..." : "Confirmar"}
                  </Button>
                </div>
                {mutationError && (
                  <p className="text-destructive text-center text-sm">
                    {mutationError}
                  </p>
                )}
              </div>
            )}

            {/* Step 3: Comprovante */}
            {bookingStep === 3 && appointmentResult && selectedSlot && (
              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>

                <h1 className="text-center text-2xl">
                  Agendamento Confirmado!
                </h1>

                <div className="text-center">
                  <Badge variant="secondary">
                    Protocolo: {appointmentResult.id.slice(0, 8).toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-6 py-6">
                  <div className="bg-muted/50 space-y-4 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="text-primary h-5 w-5" />
                      <div>
                        <p className="font-semibold">Data do Agendamento</p>
                        <p className="text-muted-foreground text-sm capitalize">
                          {formatDate(selectedDate, "EEEE, d 'de' MMMM")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="text-primary h-5 w-5" />
                      <div>
                        <p className="font-semibold">Horário</p>
                        <p className="text-muted-foreground text-sm">
                          {formatInTimeZone(
                            selectedSlot,
                            professional.timezone,
                            "HH:mm",
                          )}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3">
                      <User className="text-primary h-5 w-5" />
                      <div>
                        <p className="font-semibold">Profissional</p>
                        <p className="text-muted-foreground text-sm">
                          {professional.full_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Importante:</strong> Você receberá uma confirmação
                    por WhatsApp e e-mail. Em caso de cancelamento, avise com
                    pelo menos 2 horas de antecedência.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1" onClick={handleCloseModal}>
                    Concluir
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

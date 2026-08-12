"use client";

import { useSubmitAvailability } from "@/hooks/useSubmitAvailability";
import {
  validateWorkingDays,
  hasValidationErrors,
} from "@/lib/validateWorkingDays";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DaySchedule } from "./components/DaySchedule";
import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function createInitialDays() {
  return [
    {
      day: 1,
      enabled: true,
      blocks: [
        { id: crypto.randomUUID(), start: "09:00", end: "13:00" },
        { id: crypto.randomUUID(), start: "15:00", end: "19:00" },
      ],
    }, // Segunda-feira
    { day: 2, enabled: false, blocks: [] }, // Terça-feira
    { day: 3, enabled: false, blocks: [] }, // Quarta-feira
    { day: 4, enabled: false, blocks: [] }, // Quinta-feira
    { day: 5, enabled: false, blocks: [] }, // Sexta-feira
    { day: 6, enabled: false, blocks: [] }, // Sábado
    { day: 0, enabled: false, blocks: [] }, // Domingo
  ];
}

export default function ScheduleStep() {
  const [workingDays, setWorkingDays] = useState(createInitialDays);
  const { submit, isSubmitting, error } = useSubmitAvailability();

  const validationErrors = useMemo(
    () => validateWorkingDays(workingDays),
    [workingDays],
  );
  const isInvalid = hasValidationErrors(validationErrors);
  const hasAnyEnabledDay = workingDays.some((day) => day.enabled);

  const handleDayChange = (dayIndex, updatedDay) => {
    setWorkingDays((prev) =>
      prev.map((d, i) => (i === dayIndex ? updatedDay : d)),
    );
  };

  const handleSubmit = async () => {
    if (isInvalid) return;
    await submit(workingDays);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="p-3 pt-8 border-0 w-full shadow-xl backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-foreground text-2xl text-center">
            Disponibilidade
          </CardTitle>
          <CardDescription className="text-base text-center">
            Insira os dados da sua disponibilidade.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label>Horários de Trabalho</Label>
            <p className="text-muted-foreground text-sm">
              Defina os dias e horários em que você está disponível para
              atendimento.
            </p>
            {workingDays.map((dayData, i) => (
              <DaySchedule
                key={dayData.day}
                dayIndex={i}
                dayData={dayData}
                prevDayBlocks={workingDays[i - 1]?.blocks}
                onChange={(updated) => handleDayChange(i, updated)}
                error={validationErrors[i]}
              />
            ))}
          </div>
          {error && (
            <p className="text-destructive text-sm font-medium text-center">
              {error}
            </p>
          )}
          <div className="space-y-3 mt-8">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isInvalid || !hasAnyEnabledDay}
              className="w-full h-9 cursor-pointer"
            >
              {isSubmitting ? "Enviando..." : "Confirmar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const durationOptions = [
  { label: "10 minutos", value: "10" },
  { label: "15 minutos", value: "15" },
  { label: "20 minutos", value: "20" },
  { label: "25 minutos", value: "25" },
  { label: "30 minutos", value: "30" },
  { label: "35 minutos", value: "35" },
  { label: "40 minutos", value: "40" },
  { label: "45 minutos", value: "45" },
  { label: "50 minutos", value: "50" },
  { label: "55 minutos", value: "55" },
  { label: "1 hora", value: "60" },
  { label: "1 hora e 30 minutos", value: "90" },
  { label: "2 horas", value: "120" },
  { label: "2 horas e 30 minutos", value: "150" },
  { label: "3 horas", value: "180" },
  { label: "3 horas e 30 minutos", value: "210" },
  { label: "4 horas", value: "240" },
];

export const BRAZILIAN_TIMEZONES = [
  { label: "Noronha (UTC-02:00)", value: "America/Noronha" },
  { label: "São Paulo (UTC-03:00)", value: "America/Sao_Paulo" },
  { label: "Manaus (UTC-04:00)", value: "America/Manaus" },
  { label: "Rio Branco (UTC-05:00)", value: "America/Rio_Branco" },
];

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
            <div className="grid grid-cols-2 gap-6">
              <Field>
                <FieldLabel>Duração do Atendimento</FieldLabel>
                <Select
                  items={durationOptions}
                  defaultValue={durationOptions[4].value}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {durationOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <div>
                <Field>
                  <FieldLabel>Fuso Horário</FieldLabel>
                  <Select
                    items={BRAZILIAN_TIMEZONES}
                    defaultValue={BRAZILIAN_TIMEZONES[1].value}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {BRAZILIAN_TIMEZONES.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <p className="font-mono text-muted-foreground text-sm text-center mt-1">
                  Hora local: <span>05:50:32</span>
                </p>
              </div>
            </div>

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

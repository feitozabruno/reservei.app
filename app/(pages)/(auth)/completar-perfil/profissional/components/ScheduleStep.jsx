"use client";

import { useFieldArray, useWatch } from "react-hook-form";
import { FormDescription, FormLabel } from "@/components/ui/form";
import {
  BRAZILIAN_TIMEZONES,
  formatTimezoneName,
  calculateTimezoneFromAddress,
} from "@/lib/addressUtils";
import { DaySchedule } from "./DaySchedule";
import { useEffect } from "react";
import { useTimezoneClock } from "@/hooks/useTimezoneClock";
import { FormSelect } from "./FormSelect";

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
];

const timezoneOptions = BRAZILIAN_TIMEZONES.map((tz) => ({
  value: tz,
  label: formatTimezoneName(tz),
}));

export function ScheduleStep({ form, trigger }) {
  const { control, getValues, setValue } = form;

  const { fields } = useFieldArray({
    control,
    name: "workingDays",
  });

  const watchedTimezone = useWatch({ control, name: "timezone" });
  const watchedDays = useWatch({ control, name: "workingDays" });
  const localTime = useTimezoneClock(watchedTimezone);

  useEffect(() => {
    const { state, city, timezone } = getValues();
    if (timezone === "America/Sao_Paulo") {
      const suggestedTimezone = calculateTimezoneFromAddress(state, city);
      if (suggestedTimezone !== timezone) {
        setValue("timezone", suggestedTimezone, { shouldDirty: true });
      }
    }
  }, [getValues, setValue]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormSelect
          control={control}
          name="appointmentDuration"
          label="Duração do Atendimento"
          placeholder="Selecione a duração"
          options={durationOptions}
        />
        <div>
          <FormSelect
            control={control}
            name="timezone"
            label="Fuso Horário"
            placeholder="Selecione o fuso horário"
            options={timezoneOptions}
          />
          <FormDescription className="mt-2">
            Hora local: <span className="font-mono">{localTime}</span>
          </FormDescription>
        </div>
      </div>

      <div className="space-y-4">
        <FormLabel>Horários de Trabalho</FormLabel>
        <FormDescription>
          Defina os dias e horários em que você está disponível para
          atendimento.
        </FormDescription>
        <div className="space-y-4">
          {fields.map((day, index) => (
            <DaySchedule
              key={day.id}
              control={control}
              trigger={trigger}
              dayIndex={index}
              dayData={watchedDays[index]}
              getValues={getValues}
              setValue={setValue}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

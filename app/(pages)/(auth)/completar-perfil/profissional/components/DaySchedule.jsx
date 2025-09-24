"use client";

import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Copy } from "lucide-react";
import { TimeBlockRow } from "./TimeBlockRow";

const daysOfWeek = {
  1: "Segunda-feira",
  2: "Terça-feira",
  3: "Quarta-feira",
  4: "Quinta-feira",
  5: "Sexta-feira",
  6: "Sábado",
  7: "Domingo",
};

const addTime = (timeString, hours = 1) => {
  if (!timeString || !timeString.includes(":")) return "09:00";
  const [h, m] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(h + hours, m, 0, 0);
  return date.toTimeString().slice(0, 5);
};

export function DaySchedule({
  control,
  trigger,
  dayIndex,
  dayData,
  getValues,
  setValue,
}) {
  const dayName = `workingDays.${dayIndex}`;
  const blocksFieldName = `${dayName}.blocks`;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: blocksFieldName,
  });

  const isEnabled = dayData.enabled;
  const showCopyButton = isEnabled && dayIndex > 0 && fields.length === 0;

  const handleAddBlock = () => {
    const lastBlockEnd = fields[fields.length - 1]?.end;
    const newStart = lastBlockEnd ? lastBlockEnd : "09:00";
    const newEnd = addTime(newStart, 1);
    append({ id: crypto.randomUUID(), start: newStart, end: newEnd });
  };

  const handleCopyFromPreviousDay = () => {
    const prevDayBlocks = getValues(`workingDays.${dayIndex - 1}.blocks`);
    if (prevDayBlocks && prevDayBlocks.length > 0) {
      const blocksToCopy = prevDayBlocks.map(({ start, end }) => ({
        id: crypto.randomUUID(),
        start,
        end,
      }));
      replace(blocksToCopy);
      trigger(blocksFieldName);
    }
  };

  const handleSwitchChange = (enabled) => {
    setValue(`${dayName}.enabled`, enabled, { shouldDirty: true });
    if (!enabled) {
      replace([]);
    }
    trigger(blocksFieldName);
  };

  return (
    <div
      className={`space-y-4 rounded-lg border p-4 transition-colors ${
        isEnabled ? "border" : "bg-muted border-dashed"
      }`}
    >
      <div className="flex items-center justify-between">
        <FormLabel className="font-medium">{daysOfWeek[dayData.day]}</FormLabel>
        <FormField
          control={control}
          name={`${dayName}.enabled`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={handleSwitchChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {isEnabled ? (
        <div className="space-y-3 pt-2">
          {fields.map((block, blockIndex) => (
            <TimeBlockRow
              key={block.id}
              control={control}
              trigger={trigger}
              baseFieldName={dayName}
              blockIndex={blockIndex}
              onRemove={() => remove(blockIndex)}
            />
          ))}

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddBlock}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Horário
            </Button>
            {showCopyButton && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopyFromPreviousDay}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar do dia anterior
              </Button>
            )}
          </div>

          <FormField
            name={blocksFieldName}
            control={control}
            render={() => <FormMessage />}
          />
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          Dia desabilitado. Ative para definir os horários.
        </p>
      )}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Copy } from "lucide-react";
import { TimeBlockRow } from "./TimeBlockRow";
import { cn } from "@/lib/utils";

const daysOfWeek = {
  1: "Segunda-feira",
  2: "Terça-feira",
  3: "Quarta-feira",
  4: "Quinta-feira",
  5: "Sexta-feira",
  6: "Sábado",
  0: "Domingo",
};

const MINUTES_IN_DAY = 24 * 60;

function addMinutes(time, minutesToAdd) {
  if (!time?.includes(":")) return "09:00";
  const [h, m] = time.split(":").map(Number);
  const total = (h * 60 + m + minutesToAdd + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function DaySchedule({
  dayIndex,
  dayData,
  prevDayBlocks,
  onChange,
  error,
}) {
  const isEnabled = dayData.enabled;
  const blocks = dayData.blocks ?? [];
  const showCopyButton =
    isEnabled && dayIndex > 0 && blocks.length === 0 && !!prevDayBlocks?.length;

  const updateBlocks = (newBlocks) =>
    onChange({ ...dayData, blocks: newBlocks });

  const handleAddBlock = () => {
    const newStart = blocks[blocks.length - 1]?.end ?? "09:00";
    updateBlocks([
      ...blocks,
      {
        id: crypto.randomUUID(),
        start: newStart,
        end: addMinutes(newStart, 60),
      },
    ]);
  };

  const handleCopyFromPreviousDay = () => {
    if (!prevDayBlocks?.length) return;
    updateBlocks(
      prevDayBlocks.map(({ start, end }) => ({
        id: crypto.randomUUID(),
        start,
        end,
      })),
    );
  };

  const handleSwitchChange = (enabled) =>
    onChange({ ...dayData, enabled, blocks: enabled ? blocks : [] });

  const handleBlockChange = (blockIndex, updatedBlock) =>
    updateBlocks(blocks.map((b, i) => (i === blockIndex ? updatedBlock : b)));

  const handleRemoveBlock = (blockIndex) =>
    updateBlocks(blocks.filter((_, i) => i !== blockIndex));

  return (
    <div
      className={cn(
        "space-y-4 rounded-lg border p-4 transition-colors",
        !isEnabled && "bg-muted border-dashed",
      )}
    >
      <div className="flex items-center justify-between">
        <Label className="font-medium">{daysOfWeek[dayData.day]}</Label>
        <Switch checked={isEnabled} onCheckedChange={handleSwitchChange} />
      </div>

      {isEnabled ? (
        <div className="space-y-3 pt-2">
          {blocks.map((block, blockIndex) => (
            <TimeBlockRow
              key={block.id}
              block={block}
              onChange={(updated) => handleBlockChange(blockIndex, updated)}
              onRemove={() => handleRemoveBlock(blockIndex)}
              error={error?.blocks?.[blockIndex]}
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

          {error?.message && (
            <p className="text-destructive text-sm font-medium">
              {error.message}
            </p>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          Dia desabilitado. Ative para definir os horários.
        </p>
      )}
    </div>
  );
}

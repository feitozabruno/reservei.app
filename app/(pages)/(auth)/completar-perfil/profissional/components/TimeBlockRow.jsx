"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function TimeBlockRow({
  control,
  trigger,
  baseFieldName,
  blockIndex,
  onRemove,
}) {
  const blocksFieldName = `${baseFieldName}.blocks`;
  const fieldNameStart = `${blocksFieldName}.${blockIndex}.start`;
  const fieldNameEnd = `${blocksFieldName}.${blockIndex}.end`;

  const handleTimeChange = (field, e) => {
    field.onChange(e);
    trigger(blocksFieldName);
  };

  return (
    <div className="flex items-start gap-2">
      <FormField
        control={control}
        name={fieldNameStart}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input
                type="time"
                {...field}
                onChange={(e) => handleTimeChange(field, e)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <span className="text-muted-foreground pt-2">-</span>

      <FormField
        control={control}
        name={fieldNameEnd}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input
                type="time"
                {...field}
                onChange={(e) => handleTimeChange(field, e)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="pt-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

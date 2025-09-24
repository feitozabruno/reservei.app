"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function FormInput({
  control,
  name,
  label,
  placeholder,
  icon: Icon,
  optional = false,
  labelChildren = null,
  ...props
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center">
            {label && <FormLabel>{label}</FormLabel>}
            {optional && (
              <p className="text-muted-foreground ml-auto inline-block text-xs italic">
                opcional
              </p>
            )}
            {labelChildren}
          </div>
          <div className="relative">
            {Icon && (
              <Icon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            )}
            <FormControl>
              <Input
                className={cn(
                  "text-sm",
                  Icon ? "pl-8" : "pl-3",
                  props.className,
                )}
                placeholder={placeholder}
                {...field}
                {...props}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

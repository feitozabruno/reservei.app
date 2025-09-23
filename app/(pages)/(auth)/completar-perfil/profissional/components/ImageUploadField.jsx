"use client";

import { useRef } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useObjectUrl } from "@/hooks/useObjectUrl";

export function ImageUploadField({ control, name, children }) {
  const inputRef = useRef(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const preview = useObjectUrl(field.value);

        return (
          <FormItem className="border-b-0 p-0">
            <FormControl>
              <div>
                {children({
                  preview,
                  onClick: () => inputRef.current?.click(),
                })}
                <Input
                  ref={inputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </div>
            </FormControl>
            <FormMessage className="text-destructive absolute -bottom-6 w-full text-center" />
          </FormItem>
        );
      }}
    />
  );
}

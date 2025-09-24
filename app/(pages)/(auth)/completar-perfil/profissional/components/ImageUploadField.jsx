"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useObjectUrl } from "@/hooks/useObjectUrl";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function ImageUploadFieldContent({ field, children }) {
  const inputRef = useRef(null);
  const preview = useObjectUrl(field.value);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    const input = event.target;

    if (!file) {
      field.onChange(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("O tamanho máximo da imagem é 5MB.");
      field.onChange(null);
      input.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("O arquivo selecionado não é uma imagem válida.");
      field.onChange(null);
      input.value = "";
      return;
    }

    field.onChange(file);
  };

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
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </FormControl>
    </FormItem>
  );
}

export function ImageUploadField({ control, name, children }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <ImageUploadFieldContent field={field}>
          {children}
        </ImageUploadFieldContent>
      )}
    />
  );
}

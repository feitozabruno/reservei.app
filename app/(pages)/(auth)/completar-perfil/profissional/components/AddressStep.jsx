"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UFS, UF_NAMES } from "@/lib/addressUtils";
import { Loader2 } from "lucide-react";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";

export function AddressStep({ form, handleCepChange, isLoadingCep }) {
  const { control } = form;

  const ufOptions = UFS.map((uf) => ({ value: uf, label: UF_NAMES[uf] }));

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="address.cep"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CEP *</FormLabel>
            <FormDescription>
              Digite o CEP para preenchimento automático do endereço.
            </FormDescription>
            <div className="relative">
              <FormControl>
                <Input
                  placeholder="00000-000"
                  {...field}
                  onChange={handleCepChange}
                  maxLength={8}
                />
              </FormControl>
              {isLoadingCep && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormInput
        control={control}
        name="address.street"
        label="Rua *"
        disabled={isLoadingCep}
      />

      <FormInput
        control={control}
        name="address.number"
        label="Número *"
        placeholder="123"
      />

      <FormInput
        control={control}
        name="address.complement"
        label="Complemento"
        placeholder="Apto, sala, etc."
        optional
      />

      <FormInput
        control={control}
        name="address.neighborhood"
        label="Bairro *"
        disabled={isLoadingCep}
      />

      <FormInput
        control={control}
        name="address.city"
        label="Cidade *"
        disabled={isLoadingCep}
      />

      <FormSelect
        control={control}
        name="address.state"
        label="Estado (UF) *"
        placeholder="Selecione"
        options={ufOptions}
        disabled={isLoadingCep}
      />
    </div>
  );
}

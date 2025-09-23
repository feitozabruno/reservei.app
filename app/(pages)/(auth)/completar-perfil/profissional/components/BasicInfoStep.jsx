"use client";
import {
  User,
  AtSign,
  Phone,
  Building,
  FileText,
  Briefcase,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FormInput } from "./FormInput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export function BasicInfoStep({ form }) {
  const { control, watch } = form;
  const usernameValue = watch("username");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <FormInput
        control={control}
        name="username"
        label="Usuário *"
        placeholder="n0mePubl1c0"
        icon={AtSign}
        labelChildren={
          <p className="text-muted-foreground ml-auto inline-block text-sm italic">
            {isClient && usernameValue
              ? `reservei.app/@${usernameValue}`
              : "reservei.app/@n0mePubl1c0"}
          </p>
        }
      />

      <FormInput
        control={control}
        name="fullName"
        label="Nome de Exibição *"
        placeholder="Dr. João Silva"
        icon={User}
      />

      <FormInput
        control={control}
        name="specialty"
        label="Especialidade *"
        placeholder="Barbeiro, Manicure, Psicólogo, etc."
        icon={Briefcase}
      />

      <FormInput
        control={control}
        name="phoneNumber"
        label="Whatsapp *"
        placeholder="(10) 9.8765-4321"
        icon={Phone}
        type="tel"
      />

      <FormInput
        control={control}
        name="businessName"
        label="Empresa"
        placeholder="Nome do salão/clínica/negócio etc."
        icon={Building}
        optional
      />

      <FormField
        control={control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center">
              <FormLabel>Biografia</FormLabel>
              <p className="text-muted-foreground ml-auto inline-block text-xs italic">
                opcional
              </p>
            </div>
            <div className="relative">
              <FileText className="text-muted-foreground pointer-events-none absolute top-3.5 left-3 h-4 w-4" />
              <FormControl>
                <Textarea
                  className="resize-none pt-3 pl-8 text-sm"
                  placeholder="Fale um pouco sobre você e seu trabalho..."
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { ImageUploadField } from "./ImageUploadField";

export function ImagesStep({ form }) {
  const { control, getValues } = form;

  const fullName = getValues("fullName") || "Usuário";
  const initials = fullName.slice(0, 2).toUpperCase() || "US";

  return (
    <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="relative">
        <ImageUploadField control={control} name="coverImage">
          {({ preview, onClick }) => (
            <div
              className="relative h-32 cursor-pointer bg-gradient-to-r from-gray-800 to-gray-600 sm:h-48"
              onClick={onClick}
            >
              {preview && (
                <img
                  src={preview}
                  alt="Capa do perfil"
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="text-center">
                  <div className="mb-2 inline-flex justify-center rounded-full bg-white/20 p-3 backdrop-blur-sm">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-white">
                    {preview ? "Alterar capa" : "Adicionar capa"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </ImageUploadField>

        <div className="absolute -bottom-12 left-4 sm:left-6">
          <ImageUploadField control={control} name="profileImage">
            {({ preview, onClick }) => (
              <div className="relative cursor-pointer" onClick={onClick}>
                <Avatar className="border-background h-24 w-24 border-4 shadow-lg">
                  <AvatarImage src={preview || undefined} />
                  <AvatarFallback className="bg-muted text-muted-foreground text-2xl font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-secondary absolute -right-1 -bottom-1 rounded-full border-2 p-1.5">
                  <Camera className="text-secondary-foreground h-4 w-4" />
                </div>
              </div>
            )}
          </ImageUploadField>
        </div>
      </div>

      <div className="px-4 pt-16 pb-6 sm:px-6">
        <h2 className="text-foreground mb-1 text-xl font-bold">{fullName}</h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Adicione uma foto de perfil e de capa.
        </p>
      </div>
      <div className="bg-muted mx-4 mb-6 rounded-lg p-4">
        <h3 className="text-foreground mb-2 font-medium">
          Como adicionar fotos:
        </h3>
        <ul className="text-muted-foreground space-y-1 text-sm">
          <li>• Toque no ícone de câmera para adicionar suas imagens</li>
          <li>• Ambas as fotos são opcionais, mas altamente recomendadas</li>
          <li>
            • Tamanho recomendado: 250x250 para o perfil e 670x190 para a capa
          </li>
          <li>
            • As imagens não devem exceder 5MB e devem ser em formato JPG ou PNG
          </li>
        </ul>
      </div>
    </div>
  );
}

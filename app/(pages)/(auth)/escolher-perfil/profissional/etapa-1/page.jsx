"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, ArrowRight, Loader2 } from "lucide-react";
import { useProfileImages } from "@/hooks/useProfileImages";
import { useAuth } from "@/contexts/Auth";
import Image from "next/image";

export default function ProfileImagesPage() {
  const { user } = useAuth();

  const {
    profileImagePreview,
    coverImagePreview,
    isUploading,
    handleFileSelect,
    handleContinue,
    handleSkip,
  } = useProfileImages();

  const userData = {
    name: user?.full_name || "Usuário",
    initials: user?.full_name.slice(0, 2)?.toUpperCase() || "US",
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header */}
      <div className="border-border bg-card border-b p-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-foreground text-center text-xl font-semibold">
            Adicione suas fotos
          </h1>
          <p className="text-muted-foreground mt-1 text-center text-sm">
            Personalize seu perfil com uma foto e capa (opcional)
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Profile Preview */}
          <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
            {/* Cover Image */}
            <div className="relative">
              <div
                className="group relative h-32 cursor-pointer overflow-hidden bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-200 sm:h-48"
                onClick={() =>
                  !isUploading &&
                  document.getElementById("cover-upload").click()
                }
              >
                {/* JSX ATUALIZADO */}
                {coverImagePreview && (
                  <Image
                    src={coverImagePreview}
                    alt="Capa do perfil"
                    width="100%"
                    height="100%"
                    className="h-full w-full object-cover"
                  />
                )}

                {/* Cover Upload Overlay */}
                <div className="bg-opacity-0 group-hover:bg-opacity-40 absolute inset-0 flex items-center justify-center transition-all duration-200">
                  <div
                    className={`text-center ${coverImagePreview ? "opacity-0" : "opacity-100"} transition-opacity duration-200 group-hover:opacity-100`}
                  >
                    <div className="bg-opacity-20 mb-2 flex justify-center rounded-full bg-white p-3 backdrop-blur-sm">
                      <Camera className="h-6 w-6 text-gray-700" />
                    </div>
                    <p className="text-sm font-medium text-white">
                      {coverImagePreview ? "Alterar capa" : "Adicionar capa"}
                    </p>
                  </div>
                </div>

                {isUploading && (
                  <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
                    <div className="flex items-center space-x-3 rounded-lg bg-white p-4">
                      <Loader2 className="text-primary h-5 w-5 animate-spin" />
                      <span className="text-sm font-medium">Enviando...</span>
                    </div>
                  </div>
                )}
              </div>

              <Input
                id="cover-upload"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => handleFileSelect(e, "cover")}
              />

              {/* Profile Avatar */}
              <div className="absolute -bottom-12 left-4 sm:left-6">
                <div
                  className="group relative cursor-pointer"
                  onClick={() =>
                    !isUploading &&
                    document.getElementById("profile-upload").click()
                  }
                >
                  <Avatar className="border-card h-24 w-24 border-4 shadow-lg">
                    {/* JSX ATUALIZADO */}
                    <AvatarImage src={profileImagePreview || undefined} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-2xl font-semibold">
                      {userData.initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="bg-opacity-0 group-hover:bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-full transition-all duration-200">
                    <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <Camera className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  {/* JSX ATUALIZADO */}
                  {!profileImagePreview && (
                    <div className="border-card bg-primary absolute -right-1 -bottom-1 rounded-full border-2 p-1.5">
                      <Camera className="text-primary-foreground h-3 w-3" />
                    </div>
                  )}
                </div>

                <Input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                  onChange={(e) => handleFileSelect(e, "profile")}
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="px-4 pt-16 pb-6 sm:px-6">
              <h2 className="text-foreground mb-1 text-xl font-bold">
                {userData.name}
              </h2>
              <p className="text-muted-foreground mb-4 text-sm">
                Seu perfil está quase pronto!
              </p>

              {/* Upload Instructions */}
              <div className="bg-muted mb-6 rounded-lg p-4">
                <h3 className="text-foreground mb-2 font-medium">
                  Como adicionar fotos:
                </h3>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Toque para adicionar suas imagens</li>
                  <li>• Ambas as fotos são opcionais, mas recomendadas</li>
                  <li>
                    • Tamanho recomendado: 250x250 para o perfil e 670x190 para
                    a capa
                  </li>
                  <li>
                    • As imagens não devem exceder 5MB e devem ser em formato
                    JPG ou PNG
                  </li>
                </ul>
              </div>

              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="text-muted-foreground mb-2 flex items-center justify-between text-sm">
                  <span>Progresso do perfil</span>
                  <span>
                    {/* JSX ATUALIZADO */}
                    {profileImagePreview && coverImagePreview
                      ? "100%"
                      : profileImagePreview || coverImagePreview
                        ? "50%"
                        : "0%"}
                  </span>
                </div>
                <div className="bg-muted h-2 w-full rounded-full">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width:
                        profileImagePreview && coverImagePreview
                          ? "100%"
                          : profileImagePreview || coverImagePreview
                            ? "50%"
                            : "0%",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-border bg-card border-t p-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground"
            disabled={isUploading}
          >
            Pular por agora
          </Button>

          <Button onClick={handleContinue} disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

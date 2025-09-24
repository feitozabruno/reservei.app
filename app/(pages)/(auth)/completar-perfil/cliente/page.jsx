"use client";
import Link from "next/link";
import { useCreateClientProfile } from "@/hooks/useCreateClientProfile.js";
import { Loader2, User, Phone, Camera, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateClientPage() {
  const {
    formData,
    isLoading,
    error,
    profileImagePreview,
    handleChange,
    handleFileSelect,
    handleSubmit,
  } = useCreateClientProfile();

  return (
    <div className="mx-auto w-full max-w-md p-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Cliente</CardTitle>
          <CardDescription>
            Insira os dados para concluir o seu perfil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Profile Avatar */}
              <div className="flex justify-center">
                <div
                  className="group relative cursor-pointer"
                  onClick={() =>
                    !isLoading &&
                    document.getElementById("profile-upload").click()
                  }
                >
                  <Avatar className="border-card h-24 w-24 border-4 shadow-lg">
                    <AvatarImage src={profileImagePreview || undefined} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-2xl font-semibold">
                      <User2 height={40} width={40} />
                    </AvatarFallback>
                  </Avatar>

                  <div className="bg-opacity-0 group-hover:bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-full transition-all duration-200">
                    <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <Camera className="h-5 w-5 text-white" />
                    </div>
                  </div>

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
                  disabled={isLoading}
                  onChange={handleFileSelect}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="fullName">Nome</Label>
                <div className="relative">
                  <User className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    className="pl-8 text-sm"
                    id="fullName"
                    type="text"
                    placeholder="Seu Nome e Sobrenome"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="phoneNumber">Whatsapp</Label>
                <div className="relative">
                  <Phone className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    className="pl-8 text-sm"
                    id="phoneNumber"
                    type="number"
                    placeholder="(10) 9.8765-4321"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <p className="text-destructive text-center text-sm">{error}</p>
              )}
              <div className="flex flex-col gap-3">
                <Button
                  disabled={isLoading}
                  type="submit"
                  className="w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando perfil...
                    </>
                  ) : (
                    "Continuar"
                  )}
                </Button>

                <Link href="/escolher-perfil">
                  <Button variant="outline" className="w-full">
                    Voltar
                  </Button>
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

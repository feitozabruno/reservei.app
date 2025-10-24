"use client";
import Link from "next/link";
import { useUpdateClientProfile } from "@/hooks/useUpdateClientProfile";
import { Loader2, User, Phone, Camera, User2, Mail, Lock } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";

export function ClientProfile() {
  const {
    formData,
    isLoading,
    isFetching,
    error,
    profileImagePreview,
    handleChange,
    handleFileSelect,
    handleSubmit,
  } = useUpdateClientProfile();

  if (isFetching) {
    return <UpdateClientPageSkeleton />;
  }

  return (
    <div className="mx-auto w-full max-w-md p-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Atualizar Perfil</CardTitle>
          <CardDescription>Altere os dados do seu perfil.</CardDescription>
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
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    className="pl-8 text-sm"
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={formData.email}
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

              <div className="grid gap-3">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    className="pl-8 text-sm"
                    id="currentPassword"
                    type="password"
                    placeholder="Sua senha atual"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    className="pl-8 text-sm"
                    id="newPassword"
                    type="password"
                    placeholder="Deixe em branco para não alterar"
                    value={formData.newPassword}
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
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>

                <Link href="/dashboard/cliente">
                  <Button variant="outline" className="w-full">
                    Cancelar
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

function UpdateClientPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-md p-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Atualizar Perfil</CardTitle>
          <CardDescription>Altere os dados do seu perfil.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex justify-center">
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>
          <div className="grid gap-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

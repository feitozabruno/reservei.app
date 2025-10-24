"use client";
import { useAuth } from "@/contexts/Auth";
import { ClientProfile } from "./client-profile";
import ProfessionalProfile from "./professional-profile";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MeuPerfilPage() {
  const { user, isLoading, error } = useAuth();

  const { username, full_name: fullName } = user || {};

  console.log("User in MeuPerfilPage:", user);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || (!username && !fullName)) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p>Você ainda não criou um perfil.</p>
        <Button variant="outline">
          <Link href="/escolher-perfil">Clique aqui e Escolha um perfil</Link>
        </Button>
      </div>
    );
  }

  return username ? <ProfessionalProfile /> : <ClientProfile />;
}

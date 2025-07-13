import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Briefcase } from "lucide-react";
import Link from "next/link";

export default function EscolherPerfilPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Quase lá!</h1>
        <p className="text-muted-foreground mt-2">
          Para começar, nos diga como você pretende usar o reservei.app.
        </p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="hover:border-primary flex flex-col transition-all">
          <CardHeader className="items-center text-center">
            <User className="text-primary mx-auto mb-4 h-12 w-12" />
            <CardTitle className="text-2xl">Sou um Cliente</CardTitle>
            <CardDescription className="mt-2">
              Quero encontrar os melhores profissionais e agendar horários de
              forma rápida e fácil.
            </CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            <Link className="mx-auto" href="escolher-perfil/profissional">
              <Button>Continuar como Cliente</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="hover:border-primary flex flex-col transition-all">
          <CardHeader className="items-center text-center">
            <Briefcase className="text-primary mx-auto mb-4 h-12 w-12" />
            <CardTitle className="text-2xl">Sou um Profissional</CardTitle>
            <CardDescription className="mt-2">
              Quero oferecer meus serviços, gerenciar minha agenda e conectar-me
              com novos clientes.
            </CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            <Link className="mx-auto" href="escolher-perfil/profissional">
              <Button>Continuar como Profissional</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

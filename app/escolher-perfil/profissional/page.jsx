"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  User,
  AtSign,
  Star,
  Phone,
  Building,
  FileText,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EscolherPerfilPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    specialty: "",
    phoneNumber: "",
    businessName: "",
    bio: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/professionals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status !== 201) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao criar perfil.");
      }

      router.push("/escolher-perfil/profissional/etapa-1");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Profissional</CardTitle>
          <CardDescription>
            Insira os dados para concluir o seu perfil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="username">Usuário</Label>
                  <p className="ml-auto inline-block text-sm text-gray-400">
                    reservei.app/@n0mePubl1c0
                  </p>
                </div>
                <div className="relative">
                  <AtSign className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-8 text-sm"
                    id="username"
                    type="text"
                    placeholder="n0mePubl1c0"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="fullName">Nome</Label>
                <div className="relative">
                  <User className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-8 text-sm"
                    id="fullName"
                    type="text"
                    placeholder="Seu Nome Público"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="specialty">Especialidade</Label>
                <div className="relative">
                  <Star className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-8 text-sm"
                    id="specialty"
                    type="text"
                    placeholder="Barbeiro, Manicure, Psicólogo, etc."
                    required
                    value={formData.specialty}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="phoneNumber">N° celular</Label>
                <div className="relative">
                  <Phone className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
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
                <div className="flex items-center">
                  <Label htmlFor="businessName">Empresa</Label>

                  <p className="ml-auto inline-block text-sm text-gray-400 italic">
                    opcional
                  </p>
                </div>
                <div className="relative">
                  <Building className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-8 text-sm"
                    id="businessName"
                    type="text"
                    placeholder="Nome do salão/clínica/loja etc."
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="bio">Biografia</Label>
                  <p className="ml-auto inline-block text-sm text-gray-400 italic">
                    opcional
                  </p>
                </div>
                <div className="relative">
                  <FileText className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="bio"
                    placeholder="Fale um pouco sobre você, sua experiência e sua abordagem profissional..."
                    value={formData.bio}
                    onChange={handleChange}
                    className="min-h-[100px] pl-8 text-sm"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              {error && (
                <p className="text-center text-sm text-red-500">{error}</p>
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
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50"
                  >
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

"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, MapPin, Clock, FileText, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import Image from "next/image";

const dayNumberToLabel = {
  1: "Segunda-feira",
  2: "Terça-feira",
  3: "Quarta-feira",
  4: "Quinta-feira",
  5: "Sexta-feira",
  6: "Sábado",
  7: "Domingo",
};

const SummaryCardHeader = ({ title, icon, stepIndex, onEdit }) => (
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle className="text-card-foreground flex items-center gap-2">
      {icon}
      {title}
    </CardTitle>
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => onEdit(stepIndex)}
    >
      <Pencil className="mr-2 h-4 w-4" />
      Editar
    </Button>
  </CardHeader>
);

const SummaryItem = ({ label, children }) => (
  <div>
    <span className="text-muted-foreground text-sm">{label}:</span>
    <div className="text-foreground font-medium">
      {children || <span className="text-muted-foreground">Não informado</span>}
    </div>
  </div>
);

const BasicInfoSummary = ({ data, onEdit }) => (
  <Card>
    <SummaryCardHeader
      title="Informações Básicas"
      icon={<User className="h-5 w-5" />}
      stepIndex={0}
      onEdit={onEdit}
    />
    <CardContent className="space-y-3">
      <SummaryItem label="Nome">{data.fullName}</SummaryItem>
      <SummaryItem label="Username">@{data.username}</SummaryItem>
      <SummaryItem label="Especialidade">
        <Badge variant="secondary">{data.specialty}</Badge>
      </SummaryItem>
      <SummaryItem label="Telefone">{data.phoneNumber}</SummaryItem>
      {data.businessName && (
        <SummaryItem label="Negócio">{data.businessName}</SummaryItem>
      )}
    </CardContent>
  </Card>
);

const ProfilePreviewSummary = ({ data, onEdit }) => {
  const profilePreview = useObjectUrl(data.profileImage);
  const coverPreview = useObjectUrl(data.coverImage);

  const initials = (data.fullName || "U").slice(0, 2).toUpperCase();

  return (
    <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-600 sm:h-48">
          {coverPreview && (
            <Image
              src={coverPreview}
              alt="Capa do perfil"
              className="h-full w-full object-cover"
              width={670}
              height={190}
            />
          )}
          <div className="absolute top-2 right-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onEdit(1)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar Imagens
            </Button>
          </div>
        </div>
        <div className="absolute -bottom-12 left-4 sm:left-6">
          <Avatar className="border-background h-24 w-24 border-4 shadow-lg">
            <AvatarImage src={profilePreview || undefined} />
            <AvatarFallback className="bg-muted text-muted-foreground text-2xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="px-4 pt-16 pb-6 sm:px-6">
        <h2 className="text-foreground mb-1 text-xl font-bold">
          {data.fullName}
        </h2>
        <p className="text-muted-foreground text-sm">@{data.username}</p>
      </div>
    </div>
  );
};

const AddressSummary = ({ data, onEdit }) => (
  <Card>
    <SummaryCardHeader
      title="Endereço"
      icon={<MapPin className="h-5 w-5" />}
      stepIndex={2}
      onEdit={onEdit}
    />
    <CardContent className="space-y-3">
      <SummaryItem label="CEP">{data.address.cep}</SummaryItem>
      <SummaryItem label="Endereço">
        {data.address.street}, {data.address.number}
      </SummaryItem>
      <SummaryItem label="Bairro">{data.address.neighborhood}</SummaryItem>
      <SummaryItem label="Cidade/Estado">
        {data.address.city}, {data.address.state}
      </SummaryItem>
      <SummaryItem label="Complemento">{data.address.complement}</SummaryItem>
    </CardContent>
  </Card>
);

const ScheduleSummary = ({ data, onEdit }) => {
  const workingDays = data.workingDays.filter(
    (day) => day.enabled && day.blocks.length > 0,
  );

  return (
    <Card className="md:col-span-2">
      <SummaryCardHeader
        title="Horários de Atendimento"
        icon={<Clock className="h-5 w-5" />}
        stepIndex={3}
        onEdit={onEdit}
      />
      <CardContent>
        {workingDays.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workingDays.map((day) => (
              <div key={day.day} className="space-y-2">
                <h4 className="text-foreground font-medium">
                  {dayNumberToLabel[day.day]}
                </h4>
                {day.blocks.map((slot) => (
                  <Badge
                    key={slot.id}
                    variant="outline"
                    className="block text-center"
                  >
                    {slot.start} - {slot.end}
                  </Badge>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Nenhum horário de atendimento definido.
          </p>
        )}
        <div className="mt-4 border-t pt-4">
          <p className="text-muted-foreground text-sm">
            <strong>Duração dos agendamentos:</strong>{" "}
            {data.appointmentDuration} minutos
          </p>
          <p className="text-muted-foreground text-sm">
            <strong>Fuso horário:</strong>{" "}
            {data.timezone.replace("America/", "").replace("_", " ")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const BioSummary = ({ bio, onEdit }) => (
  <Card className="md:col-span-2">
    <SummaryCardHeader
      title="Biografia"
      icon={<FileText className="h-5 w-5" />}
      stepIndex={0}
      onEdit={onEdit}
    />
    <CardContent>
      <p className="text-foreground leading-relaxed">
        {bio || "Nenhuma biografia informada."}
      </p>
    </CardContent>
  </Card>
);

export function SummaryStep({ data, goToStep, isEditMode = false }) {
  return (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <h2 className="text-foreground mb-2 text-2xl font-bold">
          {isEditMode ? "Revisão das Alterações" : "Revisão do Perfil"}
        </h2>
        <p className="text-muted-foreground">
          {isEditMode
            ? "Revise os dados antes de salvar as alterações."
            : "Revise todos os dados antes de finalizar seu cadastro."}
        </p>
      </div>

      <ProfilePreviewSummary data={data} onEdit={goToStep} />

      <div className="flex flex-col gap-6">
        <BasicInfoSummary data={data} onEdit={goToStep} />
        <AddressSummary data={data} onEdit={goToStep} />
        <ScheduleSummary data={data} onEdit={goToStep} />
        {data.bio && <BioSummary bio={data.bio} onEdit={goToStep} />}
      </div>
    </div>
  );
}

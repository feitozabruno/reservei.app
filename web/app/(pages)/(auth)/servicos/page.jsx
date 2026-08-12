"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarClock,
  CheckCircle2,
  Pencil,
  Plus,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  DURATION_OPTIONS,
  durationLabel,
  useServicesForm,
} from "@/hooks/useServicesForm";
import { useSubmitServices } from "@/hooks/useSubmitServices";

export default function Services() {
  const {
    form,
    services,
    isEditing,
    error,
    saved,
    updateField,
    submitService,
    editService,
    cancelEditing,
    removeService,
  } = useServicesForm();

  const { submit, isSubmitting, error: submitError } = useSubmitServices();

  function handleEditService(service) {
    editService(service);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleConfirm() {
    submit(services).catch(() => {
      // erro já fica disponível em submitError para exibição na tela
    });
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="w-full border-0 p-3 pt-8 shadow-xl backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-2xl text-foreground">
            Serviços
          </CardTitle>
          <CardDescription className="text-center text-base">
            Monte a lista de serviços que seus clientes vão encontrar na hora de
            agendar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="mt-10" onSubmit={submitService}>
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-foreground">
                {isEditing ? "Editar serviço" : "Novo serviço"}
              </h2>
              {isEditing && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X size={16} /> Cancelar
                </button>
              )}
            </div>
            <p className="mt-4 text-[17px] leading-6 text-muted-foreground">
              Dê um nome ao serviço e defina o preço e o tempo de duração do
              atendimento.
            </p>

            <div className="mt-6 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="service-name"
                  className="text-[16px] font-medium"
                >
                  Nome do serviço
                </Label>
                <Input
                  id="service-name"
                  required
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Ex.: Corte de cabelo"
                  className="h-11 rounded-xl text-[16px]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="service-description"
                  className="text-[16px] font-medium"
                >
                  Descrição
                </Label>
                <Textarea
                  id="service-description"
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Descreva brevemente o serviço (opcional)"
                  rows={3}
                  className="resize-none rounded-xl text-[16px]"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="service-price"
                    className="text-[16px] font-medium"
                  >
                    Preço
                  </Label>
                  <div className="flex h-11 items-center rounded-xl border border-input bg-transparent shadow-sm focus-within:ring-1 focus-within:ring-ring">
                    <span className="pl-4 text-muted-foreground">R$</span>
                    <Input
                      id="service-price"
                      required
                      inputMode="decimal"
                      value={form.price}
                      onChange={(e) => updateField("price", e.target.value)}
                      placeholder="0,00"
                      className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-[16px] shadow-none focus-visible:ring-0 dark:bg-transparent"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="service-duration"
                    className="text-[16px] font-medium"
                  >
                    Duração do atendimento
                  </Label>
                  <Select
                    value={form.duration}
                    onValueChange={(value) => updateField("duration", value)}
                  >
                    <SelectTrigger
                      id="service-duration"
                      className="h-11! w-full rounded-xl text-[16px]"
                    >
                      <CalendarClock
                        size={16}
                        className="shrink-0 text-muted-foreground"
                      />
                      <SelectValue placeholder="Selecione">
                        {durationLabel(form.duration)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <TriangleAlert size={16} />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="mt-7 h-11 w-full rounded-xl text-[16px] font-semibold"
            >
              <Plus size={18} />
              {isEditing ? "Salvar alterações" : "Adicionar serviço"}
            </Button>

            {saved && (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-sm text-muted-foreground">
                <CheckCircle2 size={15} className="text-emerald-600" />
                Serviço salvo com sucesso.
              </p>
            )}
          </form>

          {services.length > 0 && (
            <section className="mt-10" aria-labelledby="services-list-title">
              <Separator className="mb-8" />
              <div className="flex items-center gap-2">
                <h2
                  id="services-list-title"
                  className="text-[18px] font-semibold text-foreground"
                >
                  Seus serviços
                </h2>
                <Badge variant="secondary">{services.length}</Badge>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {services.map((service) => (
                  <article
                    key={service.id}
                    className="rounded-xl border border-border bg-muted/40 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-foreground">
                          {service.name}
                        </h3>
                        {service.description && (
                          <p className="mt-1 text-sm leading-5 text-muted-foreground">
                            {service.description}
                          </p>
                        )}
                        <p className="mt-3 text-sm text-muted-foreground">
                          R$ {service.price}
                          <span className="mx-1.5 text-border">·</span>
                          {durationLabel(service.duration)}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Editar ${service.name}`}
                          onClick={() => handleEditService(service)}
                          className="size-9 rounded-lg text-muted-foreground hover:text-foreground"
                        >
                          <Pencil size={17} />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Excluir ${service.name}`}
                          onClick={() => removeService(service.id)}
                          className="size-9 rounded-lg text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={17} />
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <div className="mt-8 space-y-3">
            {submitError && (
              <Alert variant="destructive">
                <TriangleAlert size={16} />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={services.length === 0 || isSubmitting}
              className="h-9 w-full cursor-pointer"
            >
              {isSubmitting ? "Enviando..." : "Confirmar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

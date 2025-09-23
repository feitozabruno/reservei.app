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
import { Progress } from "@/components/ui/progress";
import { BasicInfoStep } from "./components/BasicInfoStep";
import { ImagesStep } from "./components/ImagesStep";
import { AddressStep } from "./components/AddressStep";
import { ScheduleStep } from "./components/ScheduleStep";
import { SummaryStep } from "./components/SummaryStep";
import { useCreateProfessional } from "@/hooks/useCreateProfessional";
import { createProfessionalStepSchemas } from "models/validator";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const steps = [
  {
    title: "Informações Básicas",
    description: "Dados pessoais e profissionais",
    Component: BasicInfoStep,
  },
  {
    title: "Imagens",
    description: "Foto de perfil e capa",
    Component: ImagesStep,
  },
  {
    title: "Endereço",
    description: "Localização do seu negócio",
    Component: AddressStep,
  },
  {
    title: "Horários",
    description: "Disponibilidade de atendimento",
    Component: ScheduleStep,
  },
  {
    title: "Resumo",
    description: "Confirme suas informações",
    Component: SummaryStep,
  },
];

export default function ProfessionalRegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const { form, isLoadingCep, handleCepChange, onSubmit } =
    useCreateProfessional();

  const {
    trigger,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const nextStep = async () => {
    const fieldsToValidate = Object.keys(
      createProfessionalStepSchemas[currentStep].shape,
    );
    const isValid = await trigger(fieldsToValidate);

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const processForm = () => {
    if (currentStep < steps.length - 1) {
      nextStep();
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const CurrentStepComponent = steps[currentStep].Component;

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="mx-auto w-full">
      <div className="mb-8 text-center">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Profissional
        </h1>
        <p className="text-muted-foreground">
          Insira os dados para concluir seu perfil
        </p>
      </div>

      <Card className="w-full border-0 shadow-xl backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground text-xl">
                {steps[currentStep].title}
              </CardTitle>
              <CardDescription>
                {steps[currentStep].description}
              </CardDescription>
            </div>
            <div className="text-muted-foreground text-sm">
              Etapa {currentStep + 1} de {steps.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()}>
              <CurrentStepComponent
                form={form}
                handleCepChange={handleCepChange}
                isLoadingCep={isLoadingCep}
                trigger={trigger}
                data={getValues()}
                goToStep={goToStep}
              />

              <div className="mt-6 flex flex-col gap-3">
                {currentStep === steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={processForm}
                    disabled={isSubmitting}
                    className="w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Finalizando cadastro...
                      </>
                    ) : (
                      "Finalizar e Criar Perfil"
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={processForm}
                    className="w-full"
                  >
                    Continuar
                  </Button>
                )}

                <Button
                  onClick={prevStep}
                  disabled={currentStep === 0 || isSubmitting}
                  variant="outline"
                  type="button"
                  className="w-full"
                >
                  Voltar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

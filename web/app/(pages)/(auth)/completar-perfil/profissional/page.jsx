"use client";

import { useCreateProfessionalProfile } from "@/hooks/useCreateProfessionalProfile";
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
  AtSign,
  User,
  Briefcase,
  MessageCircle,
  Building2,
  FileText,
} from "lucide-react";

export default function CreateProfessionalProfilePage() {
  const iconMap = {
    AtSign,
    User,
    Briefcase,
    MessageCircle,
    Building2,
    FileText,
  };

  const {
    currentStep,
    totalSteps,
    formData,
    errors,
    currentStepData,
    progressPercentage,
    isSubmitting,
    apiError,
    handleInputChange,
    handleNext,
    handleBack,
  } = useCreateProfessionalProfile();

  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="p-3 pt-8 w-full border-0 shadow-xl backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-foreground text-2xl text-center">
            {currentStepData.title}
          </CardTitle>
          <CardDescription className="text-base text-center">
            {currentStepData.subtitle}
          </CardDescription>
          <div className="w-full bg-primary/20 rounded-full h-2 mt-4">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-muted-foreground text-sm text-right">
            Etapa {currentStep} de {totalSteps}
          </div>
        </CardHeader>
        <CardContent>
          {/* Form Fields */}
          <div className="space-y-5 mb-8">
            {currentStepData.fields.map((field) => {
              const IconComponent = field.icon ? iconMap[field.icon] : null;
              return (
                <div key={field.name}>
                  <Label className="text-sm font-medium mb-2 flex justify-between items-center">
                    <span>
                      {field.label}{" "}
                      {!field.optional && (
                        <span className="text-red-500">*</span>
                      )}
                    </span>
                    {field.optional && (
                      <span className="text-muted-foreground text-xs font-normal italic">
                        opcional
                      </span>
                    )}
                    {field.hint && (
                      <span className="text-muted-foreground text-sm font-normal italic">
                        {field.hint}
                      </span>
                    )}
                  </Label>

                  {field.type === "textarea" ? (
                    <div className="relative">
                      <FileText className="text-muted-foreground pointer-events-none absolute top-3.5 left-3 h-4 w-4" />
                      <Textarea
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        className={`w-full resize-none pt-3 pl-8 text-sm ${errors[field.name] ? "border-red-500" : ""}`}
                        rows={4}
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      {IconComponent && (
                        <IconComponent className="absolute text-muted-foreground left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                      )}
                      <Input
                        type="text"
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        className={`h-9 ${field.icon ? "pl-8" : "pl-3"} ${errors[field.name] ? "border-red-500" : ""}`}
                      />
                    </div>
                  )}

                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Exibição do Erro da API */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
              {apiError}
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="w-full h-9 cursor-pointer"
            >
              {isSubmitting
                ? "Enviando..."
                : currentStep === totalSteps
                  ? "Confirmar"
                  : "Continuar"}
            </Button>

            <Button
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
              variant="outline"
              className="w-full"
            >
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

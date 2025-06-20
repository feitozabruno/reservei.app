import { SignUpForm } from "@/components/signup-form";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Image
          src="/icon.png"
          alt="Ilustração de boas-vindas"
          width={100}
          height={100}
          className="mx-auto mb-6"
        />
        <SignUpForm />
      </div>
    </div>
  );
}

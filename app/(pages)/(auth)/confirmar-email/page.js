import { Suspense } from "react";
import ConfirmarEmail from "./confirmar-email.jsx";

export default function ConfirmarEmailPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ConfirmarEmail />
    </Suspense>
  );
}

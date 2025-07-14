import { Logo } from "@/logo";
import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10">
      <Link href="/" className="mx-auto mb-6">
        <Logo width={39} height={50} />
      </Link>
      {children}
    </main>
  );
}

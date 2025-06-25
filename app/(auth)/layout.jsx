import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10">
      <Link href="/" className="mx-auto mb-6">
        <Image
          src="/icon.png"
          alt="reservei.app"
          width={100}
          height={100}
          priority
        />
      </Link>
      {children}
    </main>
  );
}

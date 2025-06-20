import Image from "next/image";

export default function AuthLayout({ children }) {
  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10">
      <Image
        src="/icon.png"
        alt="reservei.app"
        width={100}
        height={100}
        className="mx-auto mb-6"
      />
      {children}
    </main>
  );
}

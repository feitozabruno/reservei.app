import { AuthProvider } from "@/contexts/Auth";
import "@/globals.css";

export const metadata = {
  metadataBase: new URL("https://reservei.app"),

  title: "Reservei",
  description: "Reserve horários com profissionais",
  openGraph: {
    title: "Reservei",
    description: "Reserve horários com profissionais",
    url: "https://reservei.app",
    siteName: "Reservei",
    images: ["/icon.svg"],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

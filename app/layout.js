import { AuthProvider } from "@/contexts/Auth";
import "@/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./contexts/providers";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <html lang="pt-br" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster duration={4000} expand={true} richColors closeButton />
          <div className="fixed top-5 right-5">
            <ThemeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

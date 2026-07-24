import "@/globals.css";
import { ThemeProvider } from "./contexts/providers";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/sonner";

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
          {children}

          <div className="fixed top-5 right-5">
            <ThemeToggle />
          </div>
          <Toaster duration={4000} expand={true} richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}

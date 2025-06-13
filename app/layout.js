import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://reservei.app"),

  title: "Reservei",
  description: "Reserve horários com profissionais",
  openGraph: {
    title: "Reservei",
    description: "Reserve horários com profissionais",
    url: "https://reservei.app",
    siteName: "Reservei",
    images: ["/icon.png"],
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}

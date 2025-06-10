import "./globals.css";

export const metadata = {
  title: "Reservei",
  description: "Reserve horários com profissionais",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}

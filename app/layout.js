export const metadata = {
  title: "reservei.app",
  description: "agendamento online de profissionais",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}

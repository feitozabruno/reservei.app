"use client";
import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function Status() {
  return (
    <main className="bg-background flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="bg-card w-full max-w-2xl rounded-lg p-6 shadow-lg md:p-8">
        <h1 className="text-foreground mb-6 text-center text-3xl font-bold">
          Status do Sistema
        </h1>
        <UpdatedAt />
        <DatabaseStatus />
      </div>
      <footer className="text-muted-foreground mt-6 text-sm">
        Atualizações automáticas a cada 2 segundos.
      </footer>
    </main>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  return (
    <div className="text-muted-foreground mb-6 text-center text-sm">
      <span>Última verificação: </span>
      {isLoading && !data ? (
        <span className="bg-muted inline-block h-4 w-32 animate-pulse rounded-md"></span>
      ) : (
        <span className="text-foreground font-mono font-semibold">
          {new Date(data.updated_at).toLocaleString("pt-BR")}
        </span>
      )}
    </div>
  );
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  const renderContent = () => {
    if (isLoading && !data) {
      return (
        <div className="space-y-3">
          <div className="bg-muted h-5 w-full animate-pulse rounded-md"></div>
          <div className="bg-muted h-5 w-full animate-pulse rounded-md"></div>
          <div className="bg-muted h-5 w-full animate-pulse rounded-md"></div>
        </div>
      );
    }

    if (data) {
      const db = data.dependencies.database;
      return (
        <div className="space-y-3 text-sm">
          <div className="border-border flex justify-between border-b py-2">
            <span className="text-muted-foreground">Versão do PostgreSQL:</span>
            <span className="text-foreground font-mono font-semibold">
              {db.version}
            </span>
          </div>
          <div className="border-border flex justify-between border-b py-2">
            <span className="text-muted-foreground">Conexões Máximas:</span>
            <span className="text-foreground font-mono font-semibold">
              {db.max_connections}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Conexões em Uso:</span>
            <span className="text-foreground font-mono font-semibold">
              {db.open_connections}
            </span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section>
      <h2 className="border-border text-foreground mb-4 border-t pt-6 text-xl font-semibold">
        Banco de Dados
      </h2>
      <div>{renderContent()}</div>
    </section>
  );
}

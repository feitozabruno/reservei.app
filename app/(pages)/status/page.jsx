"use client";
import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function Status() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg md:p-8 dark:bg-gray-800">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-white">
          Status do Sistema
        </h1>
        <UpdatedAt />
        <DatabaseStatus />
      </div>
      <footer className="mt-6 text-sm text-gray-500 dark:text-gray-400">
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
    <div className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">
      <span>Última verificação: </span>
      {isLoading && !data ? (
        <span className="inline-block h-4 w-32 animate-pulse rounded-md bg-gray-300 dark:bg-gray-600"></span>
      ) : (
        <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
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
          <div className="h-5 w-full animate-pulse rounded-md bg-gray-300 dark:bg-gray-700"></div>
          <div className="h-5 w-full animate-pulse rounded-md bg-gray-300 dark:bg-gray-700"></div>
          <div className="h-5 w-full animate-pulse rounded-md bg-gray-300 dark:bg-gray-700"></div>
        </div>
      );
    }

    if (data) {
      const db = data.dependencies.database;
      return (
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-gray-200 py-2 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">
              Versão do PostgreSQL:
            </span>
            <span className="font-mono font-semibold text-gray-900 dark:text-white">
              {db.version}
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-200 py-2 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">
              Conexões Máximas:
            </span>
            <span className="font-mono font-semibold text-gray-900 dark:text-white">
              {db.max_connections}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600 dark:text-gray-300">
              Conexões em Uso:
            </span>
            <span className="font-mono font-semibold text-gray-900 dark:text-white">
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
      <h2 className="mb-4 border-t border-gray-200 pt-6 text-xl font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200">
        Banco de Dados
      </h2>
      <div>{renderContent()}</div>
    </section>
  );
}

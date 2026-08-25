const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : "https://reservei-bca3hzd0dtftd7b9.southcentralus-01.azurewebsites.net/api";

export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw errorData ?? new Error("Erro na requisição");
  }

  if (response.status === 204) return null;

  return response;
  // return response.json();
}

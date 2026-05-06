const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    if (data?.mensagem) {
      throw new Error(data.mensagem);
    }
    if (data?.error) {
      throw new Error(data.error);
    }
    throw new Error(response.statusText || "Erro na requisição.");
  }

  return data;
}

export async function login({ email, senha }) {
  const response = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha }),
  });
  return parseResponse(response);
}

export async function register({ nome, email, senha }) {
  const response = await fetch(`${API_URL}/api/v1/auth/cadastrar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nome, email, senha }),
  });
  return parseResponse(response);
}

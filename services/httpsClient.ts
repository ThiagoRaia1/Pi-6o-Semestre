export async function httpClient(endpoint: string, options: RequestInit) {
  // alert(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}${endpoint}`)
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_BACKEND_API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro na requisição");
  }

  return data;
}
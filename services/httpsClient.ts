import AsyncStorage from "@react-native-async-storage/async-storage";

export async function httpClient(endpoint: string, options: RequestInit) {
  const token = await AsyncStorage.getItem("token");
  // alert(token);
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_BACKEND_API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

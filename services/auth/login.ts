import { httpClient } from "../httpsClient";

export interface ILoginRequest {
  email: string;
  senha: string;
}

export interface ILoginResponse {
  access_token: string;
  nome: string;
}

export async function Login(user: ILoginRequest) {
  return await httpClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

import { ICreateUser, IUser } from "../interfaces/user";
import { httpClient } from "./httpsClient";

export async function createUsuario(usuario: ICreateUser) {
  return await httpClient("/usuarios", {
    method: "POST",
    body: JSON.stringify(usuario),
  });
}

export async function getUsers(): Promise<IUser[]> {
  return await httpClient("/usuarios", {
    method: "GET",
  });
}

export async function ativarUsuario(id: number) {
  return await httpClient(`/usuarios/ativar/${id}`, {
    method: "PATCH",
  });
}

export async function desativarUsuario(id: number) {
  return await httpClient(`/usuarios/desativar/${id}`, {
    method: "PATCH",
  });
}

export async function deleteUser(id: number) {
  return await httpClient(`/usuarios/${id}`, {
    method: "DELETE",
  });
}

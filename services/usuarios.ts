import { IUser } from "../interfaces/user";
import { httpClient } from "./httpsClient";

export async function getUsers(): Promise<IUser[]> {
  return await httpClient("/usuarios", {
    method: "GET",
  });
}

export async function deleteUser(id: number) {
  return await httpClient(`/usuarios/${id}`, {
    method: "DELETE",
  });
}

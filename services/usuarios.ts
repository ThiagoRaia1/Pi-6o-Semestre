import { IUser } from "../interfaces/user";
import { httpClient } from "./httpsClient";

export async function getUsers(): Promise<IUser[]> {
  return await httpClient("/usuarios", {
    method: "GET",
  });
}

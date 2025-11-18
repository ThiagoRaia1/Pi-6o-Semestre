import { ICreatePlanoDeAula } from "../interfaces/planoDeAula";
import { httpClient } from "./httpsClient";

export async function createPlanoDeAula(planoDeAula: ICreatePlanoDeAula) {
  return await httpClient("/planos-de-aula", {
    method: "POST",
    body: JSON.stringify(planoDeAula),
  });
}
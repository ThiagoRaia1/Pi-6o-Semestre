import { ICreatePlanoDeAula, IUpdatePlanoDeAula } from "../interfaces/planoDeAula";
import { httpClient } from "./httpsClient";

export async function createPlanoDeAula(planoDeAula: ICreatePlanoDeAula) {
  return await httpClient("/planos-de-aula", {
    method: "POST",
    body: JSON.stringify(planoDeAula),
  });
}

export async function updatePlanoDeAula(id: number, updatePlanoDeAula: IUpdatePlanoDeAula) {
  return await httpClient(`/planos-de-aula/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updatePlanoDeAula),
  });
}

import { IAula } from "../interfaces/aula";
import { httpClient } from "./httpsClient";

export async function getAulas(): Promise<IAula[]> {
  return await httpClient("/aulas", {
    method: "GET",
  });
}

export async function getAulasRegistradas(data: string): Promise<string[]> {
  return await httpClient(`/aulas/registradas/${data}`, {
    method: "GET",
  });
}

export async function getHorariosAulasCheias(data: string): Promise<string[]> {
  return await httpClient(`/aulas/cheias/${data}`, {
    method: "GET",
  });
}

export async function createAula(
  data: Date,
  usuarioId: number,
  alunosIds?: number[]
) {
  const body: any = { data, usuarioId };

  if (alunosIds && alunosIds.length > 0) {
    body.alunosIds = alunosIds;
  }

  return await httpClient("/aulas", {
    method: "POST",
    body: JSON.stringify({ data, usuarioId, alunosIds }),
  });
}

export async function updateAula(id: number, alunosIds: number[]) {
  return await httpClient(`/aulas/${id}`, {
    method: "PATCH",
    body: JSON.stringify({alunosIds}),
  });
}

export async function deleteAula(id: number) {
  return await httpClient(`/aulas/${id}`, {
    method: "DELETE",
  });
}

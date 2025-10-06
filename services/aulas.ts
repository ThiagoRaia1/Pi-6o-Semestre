import { IAula } from "../interfaces/aula";
import { httpClient } from "./httpsClient";

export async function getAulas(): Promise<IAula[]> {
  return await httpClient("/aulas", {
    method: "GET",
  });
}

export async function createAula(
  date: Date,
  usuarioId: number,
  alunosIds?: number[]
) {
  const body: any = { date, usuarioId };

  if (alunosIds && alunosIds.length > 0) {
    body.alunosIds = alunosIds;
  }

  return await httpClient("/aulas", {
    method: "POST",
    body: JSON.stringify({ date, usuarioId, alunosIds }),
  });
}

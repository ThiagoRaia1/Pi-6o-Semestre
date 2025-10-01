import { IAula } from "../interfaces/aula";
import { httpClient } from "./httpsClient";

export async function getAulas(): Promise<IAula[]> {
  return await httpClient("/aulas", {
    method: "GET",
  });
}

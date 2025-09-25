import { IAluno } from "../interfaces/aluno";
import { httpClient } from "./httpsClient";

export async function getAlunos(): Promise<IAluno[]> {
  return await httpClient("/alunos", {
    method: "GET",
  });
}

export async function getAlunoById(id: number): Promise<IAluno> {
  return await httpClient(`/alunos/id/${id}`, {
    method: "GET",
  });
}

export async function getAlunoByName(name: string): Promise<IAluno> {
  return await httpClient(`/alunos/name/${name}`, {
    method: "GET",
  });
}

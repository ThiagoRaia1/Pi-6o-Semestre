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

export async function getAlunoByNome(nome: string): Promise<IAluno> {
  return await httpClient(`/alunos/nome/${nome}`, {
    method: "GET",
  });
}

export async function ativarAluno(id: number) {
  return await httpClient(`/alunos/ativar/${id}`, {
    method: "PATCH",
  });
}

export async function desativarAluno(id: number) {
  return await httpClient(`/alunos/desativar/${id}`, {
    method: "PATCH",
  });
}

export async function deleteAluno(id: number) {
  return await httpClient(`/alunos/${id}`, {
    method: "DELETE",
  });
}

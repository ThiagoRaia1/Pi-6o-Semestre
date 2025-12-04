import { IAluno } from "./aluno";
import { IPlanoDeAula } from "./planoDeAula";
import { IUser } from "./user";

export interface IAula {
  id: number;
  data: string;
  alunos: IAluno[];
  usuario: IUser;
  planoDeAula: IPlanoDeAula;
}

export interface IUpdateAula {
  data?: string;
  alunosIds?: number[]
  usuario?: IUser;
  planoDeAula?: IPlanoDeAula;
}

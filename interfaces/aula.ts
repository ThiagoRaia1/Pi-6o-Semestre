import { IAluno } from "./aluno";
import { IUser } from "./user";

export interface IAula {
  id: number;
  date: Date;
  alunos: IAluno[];
  usuario: IUser;
}

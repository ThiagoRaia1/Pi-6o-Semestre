import { IAluno } from "./aluno";
import { IUser } from "./user";

export interface IAula {
  id: number;
  data: string;
  alunos: IAluno[];
  usuario: IUser;
}

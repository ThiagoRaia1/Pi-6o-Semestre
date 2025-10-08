import { IAluno } from "./aluno";
import { IUser } from "./user";

export interface IAula {
  id: number;
  data: Date;
  alunos: IAluno[];
  usuario: IUser;
}

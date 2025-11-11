export interface IUser {
  id: number;
  email: string;
  senha: string;
  nome: string;
  isAtivo: boolean;
}

export interface ICreateUser {
  email: string;
  senha: string;
  nome: string;
  isAtivo: boolean;
}

export interface IEditUser {
  email: string;
  senha?: string;
  nome: string;
}

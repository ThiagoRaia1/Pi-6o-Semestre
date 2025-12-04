export interface IAluno {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  descricao: string;
  isAtivo: boolean;
}

export interface ICreateAluno {
  nome?: string;
  cpf?: string;
  dataNascimento?: string;
  email?: string;
  telefone?: string;
  descricao?: string;
  isAtivo?: boolean;
}

export interface IPlanoDeAula {
  id: number;
  titulo?: string;
  plano: string;
  salvo: boolean;
}

export interface ICreatePlanoDeAula {
  titulo?: string;
  plano: string;
  salvo: boolean;
}

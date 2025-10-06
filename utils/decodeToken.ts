import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: number; // id do usuário
  exp: number; // tempo de expiração (segundos desde 1970)
  iat: number; // tempo de emissão
}

export async function decodeToken(token: string) {
  try {
    const decoded = await jwtDecode<JwtPayload>(token);
    // console.log("Id Usuário:", decoded.sub);
    // console.log("Expira em:", new Date(decoded.exp * 1000).toLocaleString());
    return decoded.sub;
  } catch (erro: any) {
    console.error("Token inválido:", erro);
    alert(erro.message);
    throw new Error(erro.message);
  }
}

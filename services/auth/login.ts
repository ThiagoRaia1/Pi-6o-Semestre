import { IUser } from "../../interfaces/user";
import { httpClient } from "../httpsClient";

export interface ILoginResponse {
    access_token: string,
    name: string
}

export async function Login(
    user: IUser
) {
    return await httpClient("/auth/login", {
        method: "POST",
        body: JSON.stringify(user),
    });
}
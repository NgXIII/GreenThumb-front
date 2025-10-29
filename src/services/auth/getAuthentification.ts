import type {UserAuthentification, UserConnection} from "@/shared/types/user.ts";
import apiClient from "@/services/http/apiClient.ts";
import type {UserCreationPost} from "@/shared/types/schemas/UserSchema.ts";

/* TODO: Changer les routes pour avoir celles correspondant au back */
/* TODO: Autoriser l'envoie de cookie sur n'importe quel domaine dans le back (Voir vidéo Grafikart "Authentifier avec des cookies sur react" vers la fin) */
export async function getAuthenticate(): Promise<UserAuthentification> {
    const response = await apiClient.get<UserAuthentification>("/me")

    return response.data
}

export async function getConnection(data: UserConnection): Promise<UserAuthentification> {
    const response = await apiClient.post<UserAuthentification>("/connection", data)

    return response.data
}

export async function getLogout(): Promise<UserAuthentification> {
    const response = await apiClient.delete<UserAuthentification>("/logout")

    return response.data
}

export async function getRegister(data: UserCreationPost): Promise<UserAuthentification> {
    const response = await apiClient.post<UserAuthentification>("/register", data)

    return response.data
}
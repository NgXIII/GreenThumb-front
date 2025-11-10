import type {UserAuthentification, UserConnection} from "@/shared/types/user.ts";
import apiClient from "@/services/http/apiClient.ts";
import type {UserCreationPost} from "@/shared/types/schemas/UserSchema.ts";

export async function getAuthenticate(): Promise<UserAuthentification> {
    const response = await apiClient.get<UserAuthentification>("/me")

    return response.data
}

export async function getConnection(data: UserConnection): Promise<UserAuthentification> {
    const response = await apiClient.post<UserAuthentification>("/sessions", data);
    return response.data;
}

export async function getLogout(): Promise<UserAuthentification> {
    const response = await apiClient.delete<UserAuthentification>("/logout")

    return response.data
}

export async function getRegister(data: UserCreationPost): Promise<void> {
    await apiClient.post<void>("/register", data)
}
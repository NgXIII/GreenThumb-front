import type {UserAccount, UserAuthentification, UserConnection} from "@/shared/types/user.ts";
import apiClient from "@/services/http/apiClient.ts";
import type {UserCreationPost} from "@/shared/types/schemas/UserSchema.ts";

export async function getAuthenticate(): Promise<UserAccount> {
    const response = await apiClient.get<UserAccount>("/users/me")

    return response.data
}

export async function getConnection(data: UserConnection): Promise<{ token: UserAuthentification }> {
    const response = await apiClient.post<UserAuthentification>("/sessions", data);
    return { token: response.data};
}

export async function getLogout(): Promise<UserAuthentification> {
    const response = await apiClient.delete<UserAuthentification>("/sessions")

    return response.data
}

export async function getRegister(data: UserCreationPost): Promise<void> {
    await apiClient.post<void>("/register", data)
}
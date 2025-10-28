import type {UserAuthentification} from "@/shared/types/user.ts";
import apiClient from "@/services/http/apiClient.ts";

export async function register(): Promise<UserAuthentification> {
    const response = await apiClient.post<UserAuthentification>("/users")

    return response.data
}
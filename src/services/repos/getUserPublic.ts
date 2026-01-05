import apiClient from "@/services/http/apiClient"
import type { UserAccount } from "@/shared/types/user"

export async function getUserByUsername(username: string): Promise<UserAccount> {
    const response = await apiClient.get<UserAccount>(`/users/${username}`)
    return response.data
}

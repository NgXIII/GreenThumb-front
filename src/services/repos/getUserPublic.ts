import apiClient from "@/services/http/apiClient"
import type {UserAccount, UserPrivateAccount} from "@/shared/types/user"

export async function getUserByUsername(username: string): Promise<UserAccount> {
    const response = await apiClient.get<UserAccount>(`/users/${username}`)
    return response.data
}

export async function getUserWithPrivateCount(username: string): Promise<UserPrivateAccount> {
    const response = await apiClient.get<UserPrivateAccount>(`/users/private/${username}`)

    return response.data
}

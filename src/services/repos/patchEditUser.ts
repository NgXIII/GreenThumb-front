import type {PasswordEditPost, UserEditPost} from "@/shared/types/schemas/UserSchema.ts";
import apiClient from "@/services/http/apiClient.ts";

export async function patchEditUser(oldUsername: string | undefined, data: UserEditPost): Promise<{ message: string }> {
    const response = await apiClient.patch<{ message: string }>(`/users/${oldUsername}`, data)
    return response.data
}

export async function patchEditPassword(oldUsername: string | undefined, data: PasswordEditPost): Promise<{ message: string }> {
    const response = await apiClient.patch<{ message: string }>(`/users/${oldUsername}/password`, data)
    return response.data
}
import type {UserEditPost} from "@/shared/types/schemas/UserSchema.ts";
import apiClient from "@/services/http/apiClient.ts";

export async function patchEditUser(oldUsername: string, data: UserEditPost): Promise<{ message: string }> {
    const response = await apiClient.patch<{ message: string }>(`/users/${oldUsername}`, data)
    return response.data
}
import apiClient from "@/services/http/apiClient";
import type { AdminUserDto, AdminUserPage, UserActionResponse, UserFilter } from "@/shared/types/admin";

export async function getAdminUsers(
    page: number = 0,
    size: number = 10,
    filter: UserFilter = 'all'
): Promise<AdminUserPage> {
    const response = await apiClient.get<AdminUserPage>('/admin/users', {
        params: { page, size, filter }
    });
    return response.data;
}

export async function getAdminUser(username: string): Promise<AdminUserDto> {
    const response = await apiClient.get<AdminUserDto>(`/admin/users/${username}`);
    return response.data;
}

export async function toggleUserActivation(
    username: string,
    enabled?: boolean
): Promise<UserActionResponse> {
    const response = await apiClient.patch<UserActionResponse>(
        `/admin/users/${username}/activate`,
        null,
        { params: enabled !== undefined ? { enabled } : undefined }
    );
    return response.data;
}

export async function softDeleteUser(username: string): Promise<UserActionResponse> {
    const response = await apiClient.delete<UserActionResponse>(`/admin/users/${username}`);
    return response.data;
}

export async function hardDeleteUser(username: string): Promise<UserActionResponse> {
    const response = await apiClient.delete<UserActionResponse>(`/admin/users/${username}/hard`);
    return response.data;
}

export async function restoreUser(username: string): Promise<UserActionResponse> {
    const response = await apiClient.patch<UserActionResponse>(`/admin/users/${username}/restore`);
    return response.data;
}
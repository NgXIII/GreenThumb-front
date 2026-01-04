import apiClient from "@/services/http/apiClient";
import type { AdminUserDto, AdminUserPage, UserActionResponse, UserSearchParams, BulkEmailRequest, BulkEmailResponse, RecipientType } from "@/shared/types/admin";

export type { RecipientType, BulkEmailRequest, BulkEmailResponse };

export async function searchAdminUsers(params: UserSearchParams = {}): Promise<AdminUserPage> {
    const { q, status = 'all', enabled, role, page = 0, size = 20 } = params;

    const queryParams: Record<string, string | number | boolean> = { page, size };

    if (q?.trim()) {
        queryParams.q = q.trim();
    }
    if (status !== 'all') {
        queryParams.status = status;
    }
    if (enabled !== undefined) {
        queryParams.enabled = enabled;
    }
    if (role && role !== 'all') {
        queryParams.role = role;
    }

    const response = await apiClient.get<AdminUserPage>('/admin/users/search', {
        params: queryParams
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

export async function sendBulkEmail(data: BulkEmailRequest): Promise<BulkEmailResponse> {
    const response = await apiClient.post<BulkEmailResponse>(
        '/admin/users/communications/send-bulk-email',
        data
    );
    return response.data;
}

export async function grantAdminRole(username: string): Promise<UserActionResponse> {
    const response = await apiClient.patch<UserActionResponse>(
        `/users/${username}/grant-admin`
    );
    return response.data;
}

export async function revokeAdminRole(username: string): Promise<UserActionResponse> {
    const response = await apiClient.patch<UserActionResponse>(
        `/users/${username}/revoke-admin`
    );
    return response.data;
}

export async function grantModeratorRole(username: string): Promise<UserActionResponse> {
    const response = await apiClient.patch<UserActionResponse>(
        `/users/${username}/grant-moderator`
    );
    return response.data;
}

export async function revokeModeratorRole(username: string): Promise<UserActionResponse> {
    const response = await apiClient.patch<UserActionResponse>(
        `/users/${username}/revoke-moderator`
    );
    return response.data;
}
export interface AdminUserDto {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    enabled: boolean;
    deleted: boolean;
    createdAt: string;
    avatar?: string;
}

export interface AdminUserPage {
    content: AdminUserDto[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
}

export type UserStatusFilter = 'all' | 'active' | 'deleted';
export type UserRoleFilter = 'all' | 'ADMIN' | 'MODERATEUR' | 'UTILISATEUR' | 'SUPER_ADMIN';
export type UserEnabledFilter = 'all' | 'true' | 'false';

export type UserFilter = UserStatusFilter;

export interface UserSearchParams {
    q?: string;
    status?: UserStatusFilter;
    enabled?: boolean;
    role?: string;
    page?: number;
    size?: number;
}

export interface UserActionResponse {
    message: string;
    enabled?: boolean;
}

export type RecipientType = 'ALL_USERS' | 'STAFF_ONLY' | 'SPECIFIC_USERS';

export interface BulkEmailRequest {
    subject: string;
    content: string;
    recipientType: RecipientType;
    recipientUsernames?: string[];
}

export interface BulkEmailResponse {
    message: string;
    totalRecipients: number;
    successCount: number;
    failureCount: number;
    failedEmails: string[];
}
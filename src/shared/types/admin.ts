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
export type UserRoleFilter = 'all' | 'ADMIN' | 'MODERATEUR' | 'UTILISATEUR';
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
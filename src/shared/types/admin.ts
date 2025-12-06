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
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}

export type UserFilter = 'all' | 'active' | 'deleted';

export interface UserActionResponse {
    message: string;
    enabled?: boolean;
}
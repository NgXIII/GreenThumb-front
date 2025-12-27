import { useCallback, useEffect, useState } from "react";
import { searchAdminUsers, toggleUserActivation, softDeleteUser, hardDeleteUser, restoreUser } from "@/services/repos/adminService";
import type { AdminUserDto, AdminUserPage, UserStatusFilter, UserRoleFilter, UserEnabledFilter } from "@/shared/types/admin";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface UseAdminUsersFilters {
    status: UserStatusFilter;
    enabled: UserEnabledFilter;
    role: UserRoleFilter;
    searchQuery: string;
}

interface UseAdminUsersReturn {
    users: AdminUserDto[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
    filters: UseAdminUsersFilters;
    setStatusFilter: (status: UserStatusFilter) => void;
    setEnabledFilter: (enabled: UserEnabledFilter) => void;
    setRoleFilter: (role: UserRoleFilter) => void;
    setSearchQuery: (query: string) => void;
    setPage: (page: number) => void;
    refresh: () => void;
    handleToggleActivation: (username: string, currentEnabled: boolean) => Promise<void>;
    handleSoftDelete: (username: string) => Promise<void>;
    handleHardDelete: (username: string) => Promise<void>;
    handleRestore: (username: string) => Promise<void>;
    actionLoading: string | null;
}

export default function useAdminUsers(initialPage: number = 0, pageSize: number = 10): UseAdminUsersReturn {
    const [usersPage, setUsersPage] = useState<AdminUserPage | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(initialPage);
    const [statusFilter, setStatusFilter] = useState<UserStatusFilter>('all');
    const [enabledFilter, setEnabledFilter] = useState<UserEnabledFilter>('all');
    const [roleFilter, setRoleFilter] = useState<UserRoleFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchUsers = useCallback(() => {
        setLoading(true);
        setError(null);

        const enabledParam = enabledFilter === 'all' ? undefined : enabledFilter === 'true';

        searchAdminUsers({
            q: searchQuery || undefined,
            status: statusFilter,
            enabled: enabledParam,
            role: roleFilter === 'all' ? undefined : roleFilter,
            page,
            size: pageSize
        })
            .then((response: AdminUserPage) => setUsersPage(response))
            .catch((e: AxiosError<{ message?: string }>) => {
                const message = e.response?.data?.message || e.message;
                setError(message);
                toast.error(message);
            })
            .finally(() => setLoading(false));
    }, [page, pageSize, statusFilter, enabledFilter, roleFilter, searchQuery]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleStatusFilterChange = (newFilter: UserStatusFilter) => {
        setStatusFilter(newFilter);
        setPage(0);
    };

    const handleEnabledFilterChange = (newFilter: UserEnabledFilter) => {
        setEnabledFilter(newFilter);
        setPage(0);
    };

    const handleRoleFilterChange = (newFilter: UserRoleFilter) => {
        setRoleFilter(newFilter);
        setPage(0);
    };

    const handleSearchQueryChange = (query: string) => {
        setSearchQuery(query);
        setPage(0);
    };

    const handleToggleActivation = async (username: string, currentEnabled: boolean) => {
        setActionLoading(username);
        try {
            const response = await toggleUserActivation(username, !currentEnabled);
            toast.success(response.message);
            fetchUsers();
        } catch (e) {
            if (e instanceof AxiosError) {
                toast.error(e.response?.data?.message || "Erreur lors de la modification");
            }
        } finally {
            setActionLoading(null);
        }
    };

    const handleSoftDelete = async (username: string) => {
        setActionLoading(username);
        try {
            const response = await softDeleteUser(username);
            toast.success(response.message);
            fetchUsers();
        } catch (e) {
            if (e instanceof AxiosError) {
                toast.error(e.response?.data?.message || "Erreur lors de la suppression");
            }
        } finally {
            setActionLoading(null);
        }
    };

    const handleHardDelete = async (username: string) => {
        setActionLoading(username);
        try {
            const response = await hardDeleteUser(username);
            toast.success(response.message);
            fetchUsers();
        } catch (e) {
            if (e instanceof AxiosError) {
                toast.error(e.response?.data?.message || "Erreur lors de la suppression définitive");
            }
        } finally {
            setActionLoading(null);
        }
    };

    const handleRestore = async (username: string) => {
        setActionLoading(username);
        try {
            const response = await restoreUser(username);
            toast.success(response.message);
            fetchUsers();
        } catch (e) {
            if (e instanceof AxiosError) {
                toast.error(e.response?.data?.message || "Erreur lors de la restauration");
            }
        } finally {
            setActionLoading(null);
        }
    };

    return {
        users: usersPage?.content ?? [],
        totalPages: usersPage?.totalPages ?? 0,
        totalElements: usersPage?.totalElements ?? 0,
        currentPage: page,
        loading,
        error,
        filters: {
            status: statusFilter,
            enabled: enabledFilter,
            role: roleFilter,
            searchQuery
        },
        setStatusFilter: handleStatusFilterChange,
        setEnabledFilter: handleEnabledFilterChange,
        setRoleFilter: handleRoleFilterChange,
        setSearchQuery: handleSearchQueryChange,
        setPage,
        refresh: fetchUsers,
        handleToggleActivation,
        handleSoftDelete,
        handleHardDelete,
        handleRestore,
        actionLoading
    };
}
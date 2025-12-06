import { useCallback, useEffect, useState } from "react";
import { getAdminUsers, toggleUserActivation, softDeleteUser, hardDeleteUser, restoreUser } from "@/services/repos/adminService";
import type { AdminUserDto, AdminUserPage, UserFilter } from "@/shared/types/admin";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface UseAdminUsersReturn {
    users: AdminUserDto[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
    filter: UserFilter;
    setFilter: (filter: UserFilter) => void;
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
    const [filter, setFilter] = useState<UserFilter>('all');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchUsers = useCallback(() => {
        setLoading(true);
        setError(null);

        getAdminUsers(page, pageSize, filter)
            .then((response: AdminUserPage) => setUsersPage(response))
            .catch((e: AxiosError<{ message?: string }>) => {
                const message = e.response?.data?.message || e.message;
                setError(message);
                toast.error(message);
            })
            .finally(() => setLoading(false));
    }, [page, pageSize, filter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleFilterChange = (newFilter: UserFilter) => {
        setFilter(newFilter);
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
        currentPage: usersPage?.number ?? 0,
        loading,
        error,
        filter,
        setFilter: handleFilterChange,
        setPage,
        refresh: fetchUsers,
        handleToggleActivation,
        handleSoftDelete,
        handleHardDelete,
        handleRestore,
        actionLoading
    };
}
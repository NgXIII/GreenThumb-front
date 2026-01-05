import { useCallback, useEffect, useState } from "react";
import { getModerationQueue, approveModerationDecision, rejectModerationDecision } from "@/services/repos/adminService";
import type { ModerationItem, ModerationFilter } from "@/shared/types/moderation";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface UseModerationReturn {
    items: ModerationItem[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
    filter: ModerationFilter;
    setFilter: (filter: ModerationFilter) => void;
    setPage: (page: number) => void;
    refresh: () => void;
    handleApprove: (messageId: number, comment?: string) => Promise<void>;
    handleReject: (messageId: number, comment?: string) => Promise<void>;
    actionLoading: number | null;
}

export default function useModeration(
    initialFilter: ModerationFilter = 'ai_rejected',
    initialPage: number = 0,
    pageSize: number = 20
): UseModerationReturn {
    const [items, setItems] = useState<ModerationItem[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [filter, setFilter] = useState<ModerationFilter>(initialFilter);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const fetchModerationQueue = useCallback(() => {
        setLoading(true);
        setError(null);

        getModerationQueue(filter, currentPage, pageSize)
            .then((response) => {
                setItems(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            })
            .catch((e: AxiosError<{ message?: string }>) => {
                const message = e.response?.data?.message || e.message || "Erreur lors du chargement";
                setError(message);
                toast.error(message);
            })
            .finally(() => setLoading(false));
    }, [filter, currentPage, pageSize]);

    useEffect(() => {
        fetchModerationQueue();
    }, [fetchModerationQueue]);

    const handleFilterChange = (newFilter: ModerationFilter) => {
        setFilter(newFilter);
        setCurrentPage(0);
    };

    const handleApprove = async (messageId: number, comment?: string) => {
        setActionLoading(messageId);
        try {
            const response = await approveModerationDecision(messageId, comment);
            toast.success(response.message || "Décision IA approuvée");
            fetchModerationQueue();
        } catch (e) {
            if (e instanceof AxiosError) {
                toast.error(e.response?.data?.message || "Erreur lors de l'approbation");
            }
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (messageId: number, comment?: string) => {
        setActionLoading(messageId);
        try {
            const response = await rejectModerationDecision(messageId, comment);
            toast.success(response.message || "Message remis en ligne");
            fetchModerationQueue();
        } catch (e) {
            if (e instanceof AxiosError) {
                toast.error(e.response?.data?.message || "Erreur lors du rejet");
            }
        } finally {
            setActionLoading(null);
        }
    };

    return {
        items,
        totalPages,
        totalElements,
        currentPage,
        loading,
        error,
        filter,
        setFilter: handleFilterChange,
        setPage: setCurrentPage,
        refresh: fetchModerationQueue,
        handleApprove,
        handleReject,
        actionLoading
    };
}

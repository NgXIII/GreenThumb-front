import {useMutation, useQuery} from "@tanstack/react-query";
import type {CreateReportRequest} from "@/shared/types/report.ts";
import apiClient from "@/services/http/apiClient.ts";
import {toast} from "sonner";
import {AxiosError} from "axios";

export const useReportMessage = () => {
    return useMutation({
        mutationFn: async (data: CreateReportRequest) => {
            const response = await apiClient.post('/reports', data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Message signalé avec succès', {
                description: 'Merci, notre équipe de modération va examiner ce message.',
                duration: 5000,
            });
        },
        onError: (error) => {
            const message = error instanceof AxiosError ? error.response?.data?.error : 'Erreur lors du signalement';
            toast.error(message);
        },
    });
}

export const useReportCount = (messageId: number | null) => {
    return useQuery({
        queryKey: ['reportCount', messageId],
        queryFn: async () => {
            if (!messageId) return { count: 0 };
            const response = await apiClient.get(`/reports/count/${messageId}`);
            return response.data;
        },
        enabled: !!messageId,
        staleTime: 30000,
    });
};
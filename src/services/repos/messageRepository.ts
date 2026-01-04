import type {ChatMessage} from "@/shared/types/channel.ts";
import apiClient from "@/services/http/apiClient.ts";

export async function getMessage(threadId: number): Promise<ChatMessage[]> {
    const response = await apiClient.get<ChatMessage[]>(`/threads/${threadId}/messages`);

    return response.data;
}
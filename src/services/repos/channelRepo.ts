import type {Channel} from "@/shared/types/channel.ts";
import apiClient from "@/services/http/apiClient.ts";

export async function getChannels(): Promise<Channel[]> {
    const response = await apiClient.get<Channel[]>("/channels");

    return response.data;
}
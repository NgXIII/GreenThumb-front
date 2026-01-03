import type {Channel, ChannelPost, ThreadPost} from "@/shared/types/channel.ts";
import apiClient from "@/services/http/apiClient.ts";

export async function getChannels(): Promise<Channel[]> {
    const response = await apiClient.get<Channel[]>("/channels");

    return response.data;
}

export async function postChannel(channel: ChannelPost): Promise<void> {
    await apiClient.post<ChannelPost>("/channels", channel);
}

export async function postThread(thread: ThreadPost): Promise<void> {
    await apiClient.post<ThreadPost>("/threads", thread);
}
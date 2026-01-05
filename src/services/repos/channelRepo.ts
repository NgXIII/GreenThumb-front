import type {Channel, ChannelPost, ThreadPost, Message} from "@/shared/types/channel.ts";
import apiClient from "@/services/http/apiClient.ts";

export async function getChannels(): Promise<Channel[]> {
    const response = await apiClient.get<Channel[]>("/channels");

    return response.data;
}

export async function getThreadMessages(threadId: number): Promise<Message[]> {
    const response = await apiClient.get<Message[]>(`/threads/${threadId}/messages`);

    return response.data;
}

export async function postChannel(channel: ChannelPost): Promise<void> {
    await apiClient.post<ChannelPost>("/channels", channel);
}

export async function postThread(thread: ThreadPost, channelName: string): Promise<void> {
    await apiClient.post<ThreadPost>(`/channels/${channelName}/threads`, thread);
}
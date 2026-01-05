import apiClient from "../http/apiClient.ts";
import type {Message} from "@/shared/types/channel.ts";

export async function getTop3Messages(): Promise<Message[]> {
    const response = await apiClient.get<Message[]>("/messages/top3like")

    return response.data;
}
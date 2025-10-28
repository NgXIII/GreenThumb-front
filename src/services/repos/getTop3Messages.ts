import type {Message} from "@/shared/types/message.ts";
import apiClient from "../http/apiClient.ts";

export async function getTop3Messages(): Promise<Message[]> {
    const response = await apiClient.get<Message[]>("/messages/top3like")

    return response.data;
}
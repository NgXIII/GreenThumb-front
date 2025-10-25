import apiClient from "../http/apiClient.ts";

export async function getUserCount(): Promise<number> {
    const response = await apiClient.get<number>("/users/count");

    return response.data;
}
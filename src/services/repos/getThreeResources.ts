import type {HomeResource} from "@/shared/types/homeResource.ts";
import apiClient from "../http/apiClient.ts";

export async function getThreeResources(): Promise<HomeResource[]> {
    const response = await apiClient.get<HomeResource[]>("/resources/three-resources");

    return response.data;
}
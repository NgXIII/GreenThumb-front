import type {Resource} from "@/shared/types/resource.ts";
import apiClient from "../http/apiClient.ts";

export async function getThreeResources(): Promise<Resource[]> {
    const response = await apiClient.get<Resource[]>("/resources/three-resources");

    return response.data;
}
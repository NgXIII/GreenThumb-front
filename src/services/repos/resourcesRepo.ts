import type {LikeResponse, Resource} from "@/shared/types/resource.ts";
import apiClient from "@/services/http/apiClient.ts";

export async function getResources(): Promise<Resource[]> {
    const resources = await apiClient.get<Resource[]>("/resources")

    return resources.data;
}

export async function getResource(slug: string): Promise<Resource> {
    const resource = await apiClient.get<Resource>(`/resources/${slug}`);

    return resource.data;
}

export async function existsBySlug(slug: string): Promise<boolean> {
    const response = await apiClient.get(`/resources/exist/${slug}`);

    return response.status === 204;
}

export async function likeResource(slug: string): Promise<LikeResponse> {
    const response = await apiClient.patch(`/resources/${slug}/like`)

    return response.data;
}
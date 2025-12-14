import type {LikeResponse, Resource} from "@/shared/types/resource.ts";
import apiClient from "@/services/http/apiClient.ts";
import type {ResourceCreationPost} from "@/shared/types/schemas/ResourceSchema.ts";

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

export async function postResource(data: ResourceCreationPost) {
    return await apiClient.post("/resources", data);
}

export async function patchResource(data: ResourceCreationPost, slug: string): Promise<void> {
    return await apiClient.patch(`/resources/${slug}`, data);
}

export async function deleteResource(slug: string): Promise<string> {
    const result = await apiClient.delete(`/resources/${slug}`);

    return result.data;
}
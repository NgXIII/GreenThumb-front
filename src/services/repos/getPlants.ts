import type {PlantPage, PlantSearchPage, PlantSearchResult} from "@/shared/types/plant.ts";
import apiClient from "@/services/http/apiClient.ts";
import type {PlantPost} from "@/shared/types/schemas/plantSchema.ts";

export async function getPlants(
    username: string | undefined,
    page: number,
    size: number,
    search?: string
    ){
    checkUsername(username);

    const params: Record<string, unknown> = { page, size };
    if (search && search.trim()) {
        params.search = search.trim();
    }

    const response = await apiClient.get<PlantPage>(`/users/${username}/plants`, {
        params
    });

    return response.data;
}

export async function getCountTask(username: string | undefined): Promise<number> {
    checkUsername(username);

    const response = await apiClient.get<number>(`/users/${username}/tasks`);

    return response.data;
}

export async function getMessagesCount(username: string | undefined): Promise<number> {
    checkUsername(username);

    const response = await apiClient.get<number>(`/users/${username}/messages/count`);

    return response.data;
}

export async function searchPlants(query: string, page: number = 1): Promise<PlantSearchPage> {
    const response = await apiClient.get<PlantSearchPage>('/plants/search', {
        params: {
            query: query,
            page: page
        }
    });

    return response.data;
}

export async function postPlant(newPlant: PlantPost): Promise<void> {
    await apiClient.post("/plants", newPlant);
}

export async function postPlantApi(newPlantApi: PlantSearchResult): Promise<void> {
    await apiClient.post("/plants/api", newPlantApi);
}

export async function deletePlant(slug: string): Promise<void> {
    await apiClient.delete(`/plants/${slug}`);
}

export async function updatePlant(slug: string, plantData: PlantPost): Promise<{ slug: string }> {
    const response = await apiClient.put<{ slug: string }>(`/plants/${slug}`, plantData);
    return response.data;
}

function checkUsername(username: string | undefined) {
    if (!username) {
        throw new Error("Aucun utilisateur");
    }
}
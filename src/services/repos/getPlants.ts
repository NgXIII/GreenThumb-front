import type {PlantPage, PlantSearchPage, PlantSearchResult} from "@/shared/types/plant.ts";
import apiClient from "@/services/http/apiClient.ts";
import type {PlantPost} from "@/shared/types/schemas/plantSchema.ts";

export interface PlantFilters {
    lifeCycle?: string[];
    waterNeed?: string[];
    lightLevel?: string[];
    soilType?: string[];
    petToxic?: boolean | null;
    humanToxic?: boolean | null;
    indoorFriendly?: boolean | null;
}

export async function getPlants(
    username: string | undefined,
    page: number,
    size: number,
    search?: string,
    filters?: PlantFilters
    ){
    checkUsername(username);

    const params: Record<string, unknown> = { page, size };
    if (search && search.trim()) {
        params.search = search.trim();
    }

    // Ajouter les filtres aux paramètres
    if (filters) {
        if (filters.lifeCycle && filters.lifeCycle.length > 0) {
            params.lifeCycle = filters.lifeCycle.join(',');
        }
        if (filters.waterNeed && filters.waterNeed.length > 0) {
            params.waterNeed = filters.waterNeed.join(',');
        }
        if (filters.lightLevel && filters.lightLevel.length > 0) {
            params.lightLevel = filters.lightLevel.join(',');
        }
        if (filters.soilType && filters.soilType.length > 0) {
            params.soilType = filters.soilType.join(',');
        }
        if (filters.petToxic !== null && filters.petToxic !== undefined) {
            params.petToxic = filters.petToxic;
        }
        if (filters.humanToxic !== null && filters.humanToxic !== undefined) {
            params.humanToxic = filters.humanToxic;
        }
        if (filters.indoorFriendly !== null && filters.indoorFriendly !== undefined) {
            params.indoorFriendly = filters.indoorFriendly;
        }
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

function checkUsername(username: string | undefined) {
    if (!username) {
        throw new Error("Aucun utilisateur");
    }
}
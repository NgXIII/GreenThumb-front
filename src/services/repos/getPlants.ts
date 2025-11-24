import type {PlantPage} from "@/shared/types/plant.ts";
import apiClient from "@/services/http/apiClient.ts";

export async function getPlants(
    username: string | undefined,
    page: number,
    size: number
    ){
    if (!username) {
        throw new Error("Aucun utilisateur");
    }

    const response = await apiClient.get<PlantPage>(`/users/${username}/plants`, {
        params: { page, size }
    });

    return response.data;
}

export async function getCountTask(): Promise<number> {
    const response = await apiClient.get<number>(`/tasks`);

    return response.data;
}
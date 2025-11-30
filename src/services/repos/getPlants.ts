import type {PlantPage} from "@/shared/types/plant.ts";
import apiClient from "@/services/http/apiClient.ts";

export async function getPlants(
    username: string | undefined,
    page: number,
    size: number
    ){
    checkUsername(username);

    const response = await apiClient.get<PlantPage>(`/users/${username}/plants`, {
        params: { page, size }
    });

    return response.data;
}

export async function getCountTask(username: string | undefined): Promise<number> {
    checkUsername(username);

    const response = await apiClient.get<number>(`/users/${username}/tasks`);

    return response.data;
}

function checkUsername(username: string | undefined) {
    if (!username) {
        throw new Error("Aucun utilisateur");
    }
}
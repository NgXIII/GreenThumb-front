import type {Plant} from "@/shared/types/plant.ts";
import apiClient from "@/services/http/apiClient.ts";

export async function getPlants(username: string | undefined): Promise<Plant[]> {
    if (!username) {
        throw new Error("Aucun utilisateur");
    }
    const response = await apiClient.get<Plant[]>(`/users/${username}/plants`);

    return response.data;
}
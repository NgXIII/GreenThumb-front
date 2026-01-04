import type {Tier} from "@/shared/types/user.ts";
import apiClient from "@/services/http/apiClient.ts";

export async function getNextTier(name: string | undefined): Promise<Tier> {
    const response = await apiClient.get(`/tiers/${name}/next`);

    return response.data;
}
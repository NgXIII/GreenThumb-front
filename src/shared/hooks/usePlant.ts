import {useEffect, useState} from "react";
import {getPlants} from "@/services/repos/getPlants.ts";
import type {PlantPage} from "@/shared/types/plant.ts";


export default function usePlant(username: string | undefined, page: number, size: number = 5) {
    const [plantsPage, setPlantsPage] = useState<PlantPage | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        getPlants(username, page, size)
            .then((response: PlantPage) => setPlantsPage(response))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [username, page, size]);

    return {
        plants: plantsPage?.content ?? [],
        totalPages: plantsPage?.totalPages ?? 0,
        currentPage: plantsPage?.number ?? 0,
        error,
        loading
    };
}
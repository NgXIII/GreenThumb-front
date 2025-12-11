import {useEffect, useState} from "react";
import {getPlants, searchPlants} from "@/services/repos/getPlants.ts";
import type {PlantPage, PlantSearchPage, PlantSearchResult} from "@/shared/types/plant.ts";


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

export function useSearchPlants() {
    const [isLoading, setIsLoading] = useState(false);
    const [plants, setPlants] = useState<PlantSearchResult[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const search = async (query: string, page: number = 1) => {
        if (!query || query.trim().length < 2) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response: PlantSearchPage = await searchPlants(query.trim(), page);

            setPlants(response.content);
            setCurrentPage(response.number + 1);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            console.error("Erreur lors de la recherche:", error);
            setPlants([]);
            setTotalPages(0);
            setTotalElements(0);

            if (error.response?.status === 503) {
                setError("Le service de recherche de plantes est temporairement indisponible. Veuillez vérifier que le backend est lancé.");
            } else if (error.code === 'ERR_NETWORK') {
                setError("Impossible de se connecter au serveur. Veuillez vérifier votre connexion et que le backend est lancé.");
            } else {
                setError("Une erreur est survenue lors de la recherche. Veuillez réessayer.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => setError(null);

    return {
        plants,
        isLoading,
        error,
        currentPage,
        totalPages,
        totalElements,
        search,
        clearError
    };
}


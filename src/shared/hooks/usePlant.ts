import {useEffect, useState, useCallback} from "react";
import {getPlants, postPlant, postPlantApi, searchPlants, deletePlant, updatePlant, type PlantFilters} from "@/services/repos/getPlants.ts";
import type {PlantPage, PlantSearchPage, PlantSearchResult} from "@/shared/types/plant.ts";
import type {PlantPost} from "@/shared/types/schemas/plantSchema.ts";
import {AxiosError} from "axios";


export default function usePlant(username: string | undefined, page: number, size: number = 5, search?: string, refreshKey: number = 0, filters?: PlantFilters) {
    const [plantsPage, setPlantsPage] = useState<PlantPage | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const refresh = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    // Sérialiser les filtres pour la dépendance
    const filtersKey = JSON.stringify(filters);

    useEffect(() => {
        if (!username) {
            setLoading(false);
            return;
        }

        setLoading(true);

        getPlants(username, page, size, search, filters)
            .then((response: PlantPage) => setPlantsPage(response))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username, page, size, search, refreshKey, filtersKey]);

    return {
        plants: plantsPage?.content ?? [],
        totalPages: plantsPage?.totalPages ?? 0,
        totalElements: plantsPage?.totalElements ?? 0,
        currentPage: plantsPage?.number ?? 0,
        error,
        loading,
        refresh
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

            console.log('API Response:', response);
            console.log('Plants content:', response.content);
            console.log('First plant:', response.content[0]);

            setPlants(response.content);
            setCurrentPage(response.number + 1);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error: unknown) {
            console.error("Erreur lors de la recherche:", error);
            setPlants([]);
            setTotalPages(0);
            setTotalElements(0);

            if (error instanceof AxiosError) {
                if (error.response?.status === 503) {
                    setError("Le service de recherche de plantes est temporairement indisponible. Veuillez vérifier que le backend est lancé.");
                } else if (error.code === 'ERR_NETWORK') {
                    setError("Impossible de se connecter au serveur. Veuillez vérifier votre connexion et que le backend est lancé.");
                } else {
                    setError("Une erreur est survenue lors de la recherche. Veuillez réessayer.");
                }
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

export function useCreatePlant() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createPlant = async (plantData: PlantPost): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            await postPlant(plantData);
            return true;
        } catch (error: unknown) {
            console.error("Erreur lors de la création de la plante:", error);

            if (error instanceof AxiosError) {
                if (error.response?.status === 400) {
                    setError("Données invalides. Veuillez vérifier les informations saisies.");
                } else if (error.response?.status === 409) {
                    setError("Une plante avec ce slug existe déjà.");
                } else if (error.code === 'ERR_NETWORK') {
                    setError("Impossible de se connecter au serveur. Veuillez vérifier que le backend est lancé.");
                } else {
                    setError("Une erreur est survenue lors de la création de la plante. Veuillez réessayer.");
                }
            } else {
                setError("Une erreur est survenue lors de la création de la plante. Veuillez réessayer.");
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => setError(null);

    return {
        createPlant,
        isLoading,
        error,
        clearError
    };
}

export function useCreatePlantApi() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createPlantApi = async (plantData: PlantSearchResult): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            await postPlantApi(plantData);
            return true;
        } catch (error: unknown) {
            console.error("Erreur lors de l'enregistrement de la plante venant de l'api:", error);

            if (error instanceof AxiosError) {
                if (error.response?.status === 400) {
                    setError("Données invalides. Veuillez vérifier les informations saisies.");
                } else if (error.response?.status === 409) {
                    setError("Une plante avec ce slug a déjà été encodée.");
                } else if (error.code === 'ERR_NETWORK') {
                    setError("Impossible de se connecter au serveur. Veuillez vérifier que le backend est lancé.");
                } else {
                    setError("Une erreur est survenue lors de l'enregistrement de la plante. Veuillez réessayer.");
                }
            } else {
                setError("Une erreur est survenue lors de l'enregistrement de la plante. Veuillez réessayer.");
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => setError(null);

    return {
        createPlantApi,
        isLoading,
        error,
        clearError
    };
}

export function useDeletePlant() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const removePlant = async (slug: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            await deletePlant(slug);
            return true;
        } catch (error: unknown) {
            console.error("Erreur lors de la suppression de la plante:", error);

            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    setError("Plante introuvable.");
                } else if (error.response?.status === 403) {
                    setError("Vous n'avez pas le droit de supprimer cette plante.");
                } else if (error.code === 'ERR_NETWORK') {
                    setError("Impossible de se connecter au serveur. Veuillez vérifier que le backend est lancé.");
                } else {
                    setError("Une erreur est survenue lors de la suppression de la plante. Veuillez réessayer.");
                }
            } else {
                setError("Une erreur est survenue lors de la suppression de la plante. Veuillez réessayer.");
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => setError(null);

    return {
        removePlant,
        isLoading,
        error,
        clearError
    };
}

export function useUpdatePlant() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const editPlant = async (slug: string, plantData: PlantPost): Promise<string | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await updatePlant(slug, plantData);
            return result.slug;
        } catch (error: unknown) {
            console.error("Erreur lors de la modification de la plante:", error);

            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    setError("Plante introuvable.");
                } else if (error.response?.status === 403) {
                    setError("Vous n'avez pas le droit de modifier cette plante.");
                } else if (error.response?.status === 400) {
                    setError("Données invalides. Veuillez vérifier les informations saisies.");
                } else if (error.code === 'ERR_NETWORK') {
                    setError("Impossible de se connecter au serveur. Veuillez vérifier que le backend est lancé.");
                } else {
                    setError("Une erreur est survenue lors de la modification de la plante. Veuillez réessayer.");
                }
            } else {
                setError("Une erreur est survenue lors de la modification de la plante. Veuillez réessayer.");
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => setError(null);

    return {
        editPlant,
        isLoading,
        error,
        clearError
    };
}

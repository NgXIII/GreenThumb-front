import {useState} from "react";
import type {LikeResponse} from "@/shared/types/resource.ts";
import {likeResource} from "@/services/repos/resourcesRepo.ts";

export function useLikeResource() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleLike = async (slug: string): Promise<LikeResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            return await likeResource(slug);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors du like");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { toggleLike, loading, error };
}
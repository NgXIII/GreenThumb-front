import {useState} from "react";
import type {ResourceCreationPost} from "@/shared/types/schemas/ResourceSchema.ts";
import {patchResource} from "@/services/repos/resourcesRepo.ts";

export default function usePatchResource() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const editResource = async (resource: ResourceCreationPost, slug: string) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await patchResource(resource, slug);
            setSuccess(true);
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { editResource, error, loading, success };
}
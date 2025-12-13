import { useState } from "react";
import { postResource } from "@/services/repos/resourcesRepo.ts";
import type { ResourceCreationPost } from "@/shared/types/schemas/ResourceSchema.ts";

export default function useAddResource() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const addResource = async (resource: ResourceCreationPost) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await postResource(resource);
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

    return { addResource, error, loading, success };
}

import type {Resource} from "@/shared/types/resource.ts";
import {useEffect, useState} from "react";
import {getResource, getResources} from "@/services/repos/resourcesRepo.ts";

export function useResources() {
    const [resources, setResource] = useState<Resource[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getResources()
            .then((resources: Resource[]) => setResource(resources))
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    }, [])

    return { resources, error, loading };
}

export function useResource(slug: string) {
    const [resource, setResource] = useState<Resource | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getResource(slug)
            .then((resources: Resource) => setResource(resources))
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    }, [slug])

    return { resource, error, loading };
}
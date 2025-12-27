import {useEffect, useState} from "react";
import type {Category} from "@/shared/types/resource.ts";
import { getCategories } from "@/services/repos/resourcesRepo";

export default function useGetCategories() {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        getCategories()
            .then((categories) => setCategories(categories))
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    }, [])

    return { categories, error, loading };
}
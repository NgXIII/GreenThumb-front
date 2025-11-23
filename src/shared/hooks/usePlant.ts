import {useEffect, useState} from "react";
import {getPlants} from "@/services/repos/getPlants.ts";
import type {Plant} from "@/shared/types/plant.ts";

export default function usePlant(username: string | undefined) {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        getPlants(username)
            .then((response) => setPlants(response))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [username]);

    return { plants, error, loading };
}
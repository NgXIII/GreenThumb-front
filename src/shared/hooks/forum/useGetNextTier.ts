import {useEffect, useState} from "react";
import type {Tier} from "@/shared/types/user.ts";
import {getNextTier} from "@/services/repos/tierRepo.ts";

export default function useGetNextTier(current: Tier | undefined) {
    const [tier, setTier] = useState<Tier | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);

        getNextTier(current?.name)
            .then(tier => setTier(tier))
            .catch(error => setError(error))
            .finally(() => setLoading(false));
    }, [current]);

    return { tier, loading, error };
}
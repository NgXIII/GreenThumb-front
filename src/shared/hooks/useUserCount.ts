import { useEffect, useState } from "react";
import { getUserCount } from "@/services/repos/getUserCount.ts";

export function useUserCount() {
    const [userCount, setUserCount] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserCount()
            .then((count) => setUserCount(count))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, []);

    return { userCount, error, loading };
}


import {useEffect, useState} from "react";
import {getMessagesCount} from "@/services/repos/getPlants.ts";

export default function useMessagesCount(username: string | undefined) {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!username) {
            setLoading(false);
            return;
        }

        setLoading(true);
        getMessagesCount(username)
            .then((count) => setCount(count))
            .catch(() => setCount(0))
            .finally(() => setLoading(false));
    }, [username]);

    return { count, loading };
}


import {useEffect, useState} from "react";
import type {Resource} from "../types/resource.ts";
import {getThreeResources} from "../../services/repos/getThreeResources.ts";

export default function useThreeResources() {
    const [messages, setMessages] = useState<Resource[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getThreeResources()
            .then((res) => setMessages(res))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { messages, error, loading };
}
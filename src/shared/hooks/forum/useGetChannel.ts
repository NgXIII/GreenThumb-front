import {useState, useEffect, useCallback} from "react";
import type {Channel} from "@/shared/types/channel.ts";
import {getChannels} from "@/services/repos/channelRepo.ts";

export default function useGetChannels() {
    const [channels, setChannels] = useState<Channel[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchChannels = useCallback(() => {
        setLoading(true);
        getChannels()
            .then(channels => setChannels(channels))
            .catch(e => setError(e.message || "Une erreur est survenue"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchChannels();
    }, [fetchChannels])

    return { channels, error, loading, refetch: fetchChannels };
}
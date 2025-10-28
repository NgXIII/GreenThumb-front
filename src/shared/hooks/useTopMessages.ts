import {getTop3Messages} from "@/services/repos/getTop3Messages.ts";
import {useEffect, useState} from "react";
import type {Message} from "../types/message.ts";

export default function useTopMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTop3Messages()
            .then((res) => setMessages(res))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { messages, error, loading };
}
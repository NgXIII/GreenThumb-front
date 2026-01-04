import { useState } from "react";
import { postChannel } from "@/services/repos/channelRepo";
import type {ChannelPost} from "@/shared/types/channel";
import {AxiosError} from "axios";
import type {ApiError} from "@/shared/types/api";

export function useCreateChannel() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<AxiosError<ApiError> | null>(null);

    const createChannel = async (channel: ChannelPost) => {
        setIsLoading(true);
        setError(null);

        try {
            await postChannel(channel);
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err);
            } else {
                setError(new AxiosError("Erreur lors de la création d'un channel"));
            }
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createChannel,
        isLoading,
        error,
    };
}

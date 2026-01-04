import { useState } from "react";
import { postThread } from "@/services/repos/channelRepo";
import type { ThreadPost } from "@/shared/types/channel";
import { AxiosError } from "axios";
import {getAuthenticate} from "@/services/auth/getAuthentification.ts";
import {useUserStore} from "@/app/stores/userStore.ts";
import type {ApiError} from "@/shared/types/api";

export function useCreateThread() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<AxiosError<ApiError> | null>(null);
    const { setUser } = useUserStore();

    const createThread = async (thread: ThreadPost, channelName: string) => {
        setIsLoading(true);
        setError(null);

        try {
            await postThread(thread, channelName);

            try {
                const updatedUser = await getAuthenticate();
                setUser(updatedUser);
            } catch (refreshError) {
                console.error("Erreur lors du rafraîchissement de l'utilisateur:", refreshError);
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err);
            } else {
                setError(new AxiosError("Erreur lors de la création du thread"));
            }
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createThread,
        isLoading,
        error,
    };
}

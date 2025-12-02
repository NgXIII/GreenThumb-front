import {useState} from "react";
import {postCodeRefreshPassword} from "@/services/repos/postCodeRefreshPassword.ts";

export default function useResetCode() {
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const sendResetCode = async (mail: string) => {
        setLoading(true);
        setError(null);

        try {
            await postCodeRefreshPassword(mail);
            return true
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Une erreur est survenue"));
            return false;
        } finally {
            setLoading(false);
        }
    }

    return { error, loading, sendResetCode };
}
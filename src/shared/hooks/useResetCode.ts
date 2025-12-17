import {useState} from "react";
import {postRefreshCode} from "@/services/repos/RefreshPassword.ts";

export default function useResetCode() {
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const sendResetCode = async (mail: string) => {
        setLoading(true);
        setError(null);

        try {
            await postRefreshCode(mail);
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
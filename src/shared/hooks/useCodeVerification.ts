import {useState} from "react";
import {postVerificationCode} from "@/services/repos/RefreshPassword.ts";
import type {AxiosError} from "axios";

interface UseCodeVerificationReturn {
    verifyCode: (code: string, email: string) => Promise<boolean>;
    loading: boolean;
    error: string | null;
}

export default function useCodeVerification(): UseCodeVerificationReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const verifyCode = async (code: string, email: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            await postVerificationCode({ code, email });
            return true;
        } catch (error) {
            const axiosError = error as AxiosError<{ error?: string}>;

            if (axiosError.response?.status === 400) {
                setError(axiosError.response.data?.error || "Code incorrect");
            } else {
                setError("Une erreur est survenue. Veuillez réessayer.");
            }

            return false;
        } finally {
            setLoading(false);
        }
    }

    return { verifyCode, loading, error };
}
import {useNavigate} from "react-router-dom";
import {patchPasswordReset} from "@/services/repos/RefreshPassword.ts";
import {toast} from "sonner";
import {useState} from "react";

interface ResetPasswordParams {
    password: string;
    confirmPassword: string;
    email: string;
}

export function useResetPassword() {
    const navigate = useNavigate();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = async ({ password, confirmPassword, email }: ResetPasswordParams) => {
        setIsPending(true);
        setError(null);

        try {
            await patchPasswordReset({ password, confirmPassword }, email.toLowerCase());
            toast.success("Mot de passe modifié avec succès", {
                description: "Vous pouvez maintenant vous connecter.",
            });
            navigate("/connexion", { replace: true });
        } catch (e) {
            const message = e instanceof Error ? e.message : "Une erreur est survenue";
            setError(message);
            toast.error("Erreur", { description: message });
        } finally {
            setIsPending(false);
        }
    };

    return { mutate, isPending, error };
}
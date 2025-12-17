import apiClient from "@/services/http/apiClient.ts";
import {AxiosError} from "axios";

interface CodeVerificationRequest {
    code: string;
    email: string;
}


interface ApiErrorResponse {
    message?: string;
    error?: string;
}

interface Passwords {
    password: string;
    confirmPassword: string;
}
export async function postRefreshCode(mail: string): Promise<void> {
    try {
        await apiClient.post("/codes", { email: mail });
    } catch (error) {
        extractErrorMessage(error, "Erreur lors de l'envoi du code");
    }
}

export async function postVerificationCode(data: CodeVerificationRequest): Promise<void> {
    try {
        await apiClient.post("/users/verification", data);
    } catch (error) {
        extractErrorMessage(error, "Code de vérification invalide");
    }
}

export async function patchPasswordReset(data: Passwords, email: string): Promise<void> {
    try {
        await apiClient.patch(`/users/${email}/resetPassword`, data);
    } catch (error) {
        extractErrorMessage(error, "Erreur lors de la réinitialisation du mot de passe");
    }
}

function extractErrorMessage(error: unknown, defaultMessage: string): never {
    if (error instanceof AxiosError) {
        const data = error.response?.data as ApiErrorResponse | undefined;
        const message = data?.message || data?.error || defaultMessage;
        throw new Error(message);
    }
    throw new Error(defaultMessage);
}
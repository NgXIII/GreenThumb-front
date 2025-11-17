import {useAccountStore} from "@/app/stores/userStore.ts";
import apiClient from "@/services/http/apiClient.ts";
import {AxiosError} from "axios";
import {redirect} from "react-router-dom";
import {verifyToken} from "@/services/auth/verifyToken.ts";

const REFRESH_ENDPOINT = "/sessions/refresh";

type AccessToken = string;
type RefreshSessionsApiResponse = { accessToken: string } | string;

function extractAccessToken(data: RefreshSessionsApiResponse): AccessToken | null {
    if (typeof data === "string") {
        return data.trim() || null;
    }

    if (typeof data === "object") {
        return data.accessToken.trim() || null;
    }

    return null;
}

async function refreshSession(): Promise<AccessToken | null>  {
    const { setAccount } = useAccountStore.getState();

    try {
        const { data } = await apiClient.post<RefreshSessionsApiResponse>(
            REFRESH_ENDPOINT,
            {},
            { withCredentials: true }
        );

        const newAccessToken = extractAccessToken(data);

        if(!newAccessToken) {
            setAccount(null);
            return null
        }

        setAccount({ token: newAccessToken });
        return newAccessToken;
    } catch (error) {
        const message = error instanceof AxiosError
            ? error.response?.data ?? error.message
            : String(error);

        console.warn("[accountLoader] Echec du refresh :", message);
        setAccount(null);
        return null
    }
}

async function tryRefresh() {
    const refreshedToken = await refreshSession();
    if (!refreshedToken) {
        throw redirect("/connexion");
    }

    return null
}

export async function accountLoader() {
    const { account } = useAccountStore.getState();
    const currentToken = account?.token;

    if(!currentToken) {
        return await tryRefresh();
    }

    try {
        const isValid = await verifyToken(currentToken);

        if(isValid) {
            return null;
        }

       return await tryRefresh();
    } catch {
       return await tryRefresh();
    }
}

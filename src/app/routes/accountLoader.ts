import {useAccountStore} from "@/app/stores/userStore.ts";
import axios from "axios";
import {verifyToken} from "@/services/auth/verifyToken.ts";
import {redirect} from "react-router-dom";

export async function accountLoader() {
    const {account, setAccount} = useAccountStore.getState();

    // ⚙️ Helper pour tenter un refresh
    async function tryRefresh() {
        try {
            const response = await axios.post("/api/sessions/refresh", {}, {withCredentials: true});
            const newAccessToken = response.data;
            if (!newAccessToken) throw new Error("No token received");
            setAccount({token: newAccessToken});
            return true;
        } catch (err) {
            console.warn("Refresh échoué :", err);
            setAccount(null);
            return false;
        }
    }

    if (!account?.token) {
        const refreshed = await tryRefresh();
        if (!refreshed) {
            throw redirect("/connexion");
        }
        return null;
    }

    const valid = await verifyToken(account.token);

    if (!valid) {
        console.warn("Token invalide, tentative de refresh...");
        const refreshed = await tryRefresh();
        if (!refreshed) throw redirect("/connexion");
    }

    return null;
}
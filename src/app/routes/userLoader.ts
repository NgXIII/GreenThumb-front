import {useUserStore} from "@/app/stores/userStore.ts";
import {getAuthenticate} from "@/services/auth/getAuthentification.ts";

export async function userLoader() {
    const { setUser, clearUser } = useUserStore.getState();

    try {
        const user = await getAuthenticate();
        setUser(user);
        return null;
    } catch {
        clearUser();
        return null;
    }
}
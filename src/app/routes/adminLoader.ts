import {useUserStore} from "@/app/stores/userStore.ts";
import {redirect} from "react-router-dom";

export const adminLoader = async () => {
    const { user } = useUserStore.getState();

    if (!user) {
        return redirect("/connexion");
    }

    if (user.role !== "ADMIN") {
        return redirect("/dashboard");
    }

    return user;
};
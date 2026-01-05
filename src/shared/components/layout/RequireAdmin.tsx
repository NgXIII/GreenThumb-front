import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "@/app/stores/userStore.ts";

const RequireAdmin = () => {
    const user = useUserStore((state) => state.user);

    if (!user) {
        return <Navigate to="/connexion" replace />;
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default RequireAdmin;
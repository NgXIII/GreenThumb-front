import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "@/app/stores/userStore.ts";

const RequireSuperAdmin = () => {
    const user = useUserStore((state) => state.user);

    if (!user) {
        return <Navigate to="/connexion" replace />;
    }

    if (user.role !== "SUPER_ADMIN") {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
};

export default RequireSuperAdmin;

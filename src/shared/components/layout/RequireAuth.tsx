import {useAuth} from "@/shared/hooks/useAuth.ts";
import {Navigate, Outlet} from "react-router-dom";

export default function RequireAuth() {
    const { status } = useAuth();

    if (status === 2) {
        return <Navigate to="/" replace />;
    }

    if (status === 0) {
        return <div>Chargement...</div>;
    }

    return <Outlet />;
}
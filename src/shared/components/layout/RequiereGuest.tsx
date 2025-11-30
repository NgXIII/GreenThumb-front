import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth.ts";


export default function RequireGuest() {
    const { status } = useAuth();

    if (status === 1) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
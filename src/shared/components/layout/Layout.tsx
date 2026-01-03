import NavBar from "./NavBar.tsx";
import Footer from "./Footer.tsx";
import {Outlet} from "react-router-dom";
import {useAuth} from "@/shared/hooks/useAuth.ts";
import { NotificationToastProvider } from "../notifications/NotificationToast";

export default function Layout() {
    const {status} = useAuth()

    return (
        <>
            <NavBar isAuthenticated ={status == 1} />
            {status === 1 && <NotificationToastProvider />}
            <Outlet/>
            <Footer/>
        </>
    )
}
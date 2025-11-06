import NavBar from "./NavBar.tsx";
import Footer from "./Footer.tsx";
import {Outlet} from "react-router-dom";
import {useAuth} from "@/shared/hooks/useAuth.ts";

export default function Layout() {
    const {status} = useAuth()

    return (
        <>
            <NavBar isAuthenticated ={status == 1} />
            <Outlet/>
            <Footer/>
        </>
    )
}
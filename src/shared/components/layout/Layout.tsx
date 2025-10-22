import NavBar from "./NavBar.tsx";
import Footer from "./Footer.tsx";
import {Outlet} from "react-router-dom";

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar/>
            <Outlet/>
            <Footer/>
        </div>
    )
}
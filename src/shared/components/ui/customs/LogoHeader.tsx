import {Link} from "react-router-dom";
import logo from "@/assets/logo.png";

export default function LogoHeader() {
    return (
        <header className="w-full px-4 py-4">
            <Link to="/" className="block mx-auto lg:mx-0 w-24">
                <img
                    src={logo}
                    alt="Logo"
                    className="max-w-full h-auto w-24 transition-transform duration-300 ease-out hover:scale-105"
                />
            </Link>
        </header>
    );
}
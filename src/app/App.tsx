import {RouterProvider} from "react-router-dom";
import router from "./routes/Router.tsx";
import {useAuth, AuthStatus} from "@/shared/hooks/useAuth.ts";
import { LoaderCircle } from 'lucide-react';


/* TODO: Faire en sorte de gérer le cas où les cookies sont delete */
export default function App() {
    const {status} = useAuth()

    if(status == AuthStatus.Unknown) {
        return <>
            <LoaderCircle />
        </>
    }else {
        return (
            <RouterProvider router={router} />
        )
    }
}
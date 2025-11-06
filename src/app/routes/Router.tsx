import { createBrowserRouter,  } from "react-router-dom"
import Layout from "../../shared/components/layout/Layout.tsx";
import ErrorPage from "../../pages/ErrorPage.tsx";
import RegisterPage from "@/pages/registerPage/RegisterPage.tsx";
import HomePage from "@/pages/homePage/HomePage.tsx";
import {ProfilePage} from "@/pages/profilePage/ProfilePage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: '/dashboard',
                //element: <DashboardPage/>
            },
            {
                path: '/community',
                //element: <CommunautePage/>
            },
            {
                path: '/ressources',
                //element: <RessourcesPage/>
            },
            {
                path: '/profile',
                element: <ProfilePage/>
            },
        ],
    },
    {
        path: "/inscription",
        element: <RegisterPage />,
    },
    {
        path: "/connexion",
        //element: <ConnectionPage />
    },
]);

export default router
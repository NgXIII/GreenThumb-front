import { createBrowserRouter,  } from "react-router-dom"
import Layout from "../../shared/components/layout/Layout.tsx";
import ErrorPage from "../../pages/ErrorPage.tsx";
import RegisterPage from "../../pages/RegisterPage/RegisterPage.tsx";
import HomePage from "@/pages/homePage/HomePage.tsx";
import LoginPage from "@/pages/LoginPage/LoginPage.tsx";
import VerifyEmailPage from "@/pages/VerifyEmailPage/VerifyEmailPage.tsx";

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
                //element: <ProfilPage/>
            },
        ],
    },
    {
        path: "/inscription",
        element: <RegisterPage />,
    },
    {
        path: "/connexion",
        element: <LoginPage />
    },
    {
        path: "/verify-email",
        element: <VerifyEmailPage />
    },
]);

export default router
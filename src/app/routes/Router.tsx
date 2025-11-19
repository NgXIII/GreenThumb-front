import { createBrowserRouter  } from "react-router-dom"
import Layout from "../../shared/components/layout/Layout.tsx";
import ErrorPage from "../../pages/ErrorPage.tsx";
import RegisterPage from "../../pages/RegisterPage/RegisterPage.tsx";
import HomePage from "@/pages/homePage/HomePage.tsx";
import LoginPage from "@/pages/LoginPage/LoginPage.tsx";
import {accountLoader} from "@/app/routes/accountLoader.ts";
import VerifyEmailPage from "@/pages/VerifyEmailPage/VerifyEmailPage.tsx";
import RequireAuth from "@/shared/components/layout/RequireAuth.tsx";
import RequireGuest from "@/shared/components/layout/RequiereGuest.tsx";
import {userLoader} from "@/app/routes/userLoader.ts";
import Dashboard from "@/pages/Dashboard/Dashboard.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                loader: userLoader,
                element: <RequireGuest />,
                children: [
                    {
                        index: true,
                        element: <HomePage />
                    }
                ]
            },
            {
                element: <RequireAuth />,
                loader: userLoader,
                children: [
                    {
                        path: '/dashboard',
                        loader: accountLoader,
                        element: <Dashboard />
                    }
                ]
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
        element: <RequireGuest />,
        children: [
            { path: "/inscription", element: <RegisterPage /> },
            { path: "/connexion", element: <LoginPage /> },
        ]
    },
    {
        path: "/verify-email",
        element: <VerifyEmailPage />
    },
]);

export default router
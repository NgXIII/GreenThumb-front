import { createBrowserRouter  } from "react-router-dom"
import Layout from "../../shared/components/layout/Layout.tsx";
import ErrorPage from "../../pages/ErrorPage.tsx";
import RegisterPage from "@/pages/registerPage/RegisterPage.tsx";
import HomePage from "@/pages/homePage/HomePage.tsx";
import ProfilePage from "@/pages/profilePage/ProfilePage.tsx";
import LoginPage from "@/pages/LoginPage/LoginPage.tsx";
import {accountLoader} from "@/app/routes/accountLoader.ts";
import VerifyEmailPage from "@/pages/VerifyEmailPage/VerifyEmailPage.tsx";
import LegalNoticePage from "@/pages/Legal/LegalNoticePage.tsx";
import PrivacyPolicyPage from "@/pages/Legal/PrivacyPolicyPage.tsx";
import TermsOfUsePage from "@/pages/Legal/TermsOfUsePage.tsx";
import RequireAuth from "@/shared/components/layout/RequireAuth.tsx";
import RequireGuest from "@/shared/components/layout/RequiereGuest.tsx";
import {userLoader} from "@/app/routes/userLoader.ts";
import Dashboard from "@/pages/Dashboard/Dashboard.tsx";
import AdminPage from "@/pages/adminPage/AdminPage.tsx";
import RequireAdmin from "@/shared/components/layout/RequireAdmin.tsx";
import EditPassword from "@/pages/profilePage/EditPassword.tsx";

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
                    },
                    {
                        path: '/profil',
                        loader: accountLoader,
                        element: <ProfilePage />
                    },
                    {
                        path: '/modification-mot-de-passe',
                        loader: accountLoader,
                        element: <EditPassword />
                    }
                ]
            },
            {
                element: <RequireAdmin />,
                loader: userLoader,
                children: [
                    {
                        path: '/admin',
                        loader: accountLoader,
                        element: <AdminPage />
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
                path: "/legal-notice",
                element: <LegalNoticePage />
            },
            {
                path: "/rgpd",
                element: <PrivacyPolicyPage />
            },
            {
                path: "/cgu",
                element: <TermsOfUsePage />
            },
        ],
    },
    {
        element: <RequireGuest />,
        children: [
            { path: "/inscription", element: <RegisterPage /> },
            { path: "/connexion", element: <LoginPage /> },
        ]
    },
    {
        path: "/verifier-email",
        element: <VerifyEmailPage />
    },
]);

export default router
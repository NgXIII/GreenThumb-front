import { createBrowserRouter  } from "react-router-dom"
import Layout from "../../shared/components/layout/Layout.tsx";
import ErrorPage from "../../pages/ErrorPage.tsx";
import RegisterPage from "@/pages/registerPage/RegisterPage.tsx";
import HomePage from "@/pages/homePage/HomePage.tsx";
import ProfilePage from "@/pages/profilePage/ProfilePage.tsx";
import LoginPage from "@/pages/LoginPage/LoginPage.tsx";
import AccountDebugPage from "@/pages/AccountDebugPage.tsx";
import {accountLoader} from "@/app/routes/accountLoader.ts";
import VerifyEmailPage from "@/pages/VerifyEmailPage/VerifyEmailPage.tsx";
import LegalNoticePage from "@/pages/Legal/LegalNoticePage.tsx";
import PrivacyPolicyPage from "@/pages/Legal/PrivacyPolicyPage.tsx";
import TermsOfUsePage from "@/pages/Legal/TermsOfUsePage.tsx";

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
                path: '/profil',
                element: <ProfilePage/>
            },
            {
                path: '/account',
                loader: accountLoader,
                element: <AccountDebugPage />
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
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
import AdminTest from "@/pages/AdminTest.tsx";
import RequireAdmin from "@/shared/components/layout/RequireAdmin.tsx";
import ForgetPasswordPage from "@/pages/forgetPassword/ForgetPasswordPage.tsx";
import EditPassword from "@/pages/profilePage/EditPassword.tsx";
import ResetPassword from "@/pages/forgetPassword/ResetPassword.tsx";
import ResourcePage from "@/pages/Resource/ResourcePage.tsx";
import ResourcePageDetail from "@/pages/Resource/ResourcePageDetail.tsx";
import {combineLoaders} from "@/app/routes/combineLoaders.ts";
import {articleLoader} from "@/app/routes/articleLoader.ts";
import ResourceFormulairePage from "@/pages/Resource/formulaire/ResourceFormulairePage.tsx";

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
                    },
                    {
                        path: '/ressources',
                        loader: accountLoader,

                        element: <ResourcePage/>
                    },
                    {
                        path: '/ressources/:slug',
                        loader: combineLoaders(accountLoader, articleLoader),

                        element: <ResourcePageDetail />
                    },
                ]
            },
            {
                element: <RequireAdmin />,
                loader: userLoader,
                children: [
                    {
                        path: '/admin',
                        loader: accountLoader,
                        element: <AdminTest />
                    },
                    {
                        path:'/ressources/ajouter',
                        loader: accountLoader,
                        element: <ResourceFormulairePage />
                    }
                ]
            },
            {
                path: '/community',
                //element: <CommunautePage/>
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
            {
                path: "/connexion",
                element: <LoginPage /> ,
            },
            {
                path: "/connexion/forgetPassword",
                element: <ForgetPasswordPage/>
            },
            {
                path: "/connexion/reset-password",
                element: <ResetPassword />
            }
        ]
    },
    {
        path: "/verifier-email",
        element: <VerifyEmailPage />
    },
]);

export default router
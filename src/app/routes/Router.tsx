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
import RequireAdmin from "@/shared/components/layout/RequireAdmin.tsx";
import RequireSuperAdmin from "@/shared/components/layout/RequireSuperAdmin.tsx";
import RequireAdminOrModerator from "@/shared/components/layout/RequireAdminOrModerator.tsx";
import AdminLayout from "@/pages/adminPage/components/AdminLayout.tsx";
import AdminDashboard from "@/pages/adminPage/AdminDashboard.tsx";
import UserManagement from "@/pages/adminPage/UserManagement.tsx";
import BulkEmail from "@/pages/adminPage/BulkEmail.tsx";
import RoleManagement from "@/pages/adminPage/RoleManagement.tsx";
import ModerationPage from "@/pages/adminPage/ModerationPage.tsx";
import ForgetPasswordPage from "@/pages/forgetPassword/ForgetPasswordPage.tsx";
import EditPassword from "@/pages/profilePage/EditPassword.tsx";
import ResetPassword from "@/pages/forgetPassword/ResetPassword.tsx";
import ResourcePage from "@/pages/Resource/ResourcePage.tsx";
import ResourcePageDetail from "@/pages/Resource/ResourcePageDetail.tsx";
import {combineLoaders} from "@/app/routes/combineLoaders.ts";
import {articleLoader} from "@/app/routes/articleLoader.ts";
import ResourceFormulairePage from "@/pages/Resource/formulaire/ResourceFormulairePage.tsx";
import CreateApiPlantPage from "@/pages/plantCreationPage/CreateApiPlantPage.tsx";
import ForumPage from "@/pages/forumPage/ForumPage.tsx";
import PublicProfilePage from "@/pages/profilePage/PublicProfilePage.tsx";

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
                        path: '/profil/:username',
                        loader: accountLoader,
                        element: <PublicProfilePage />
                    },
                    {
                        path: '/modification-mot-de-passe',
                        loader: accountLoader,
                        element: <EditPassword />
                    },
                    {
                        path: '/creation-plante/:plantSlug?',
                        loader: accountLoader,
                        element: <CreateApiPlantPage />
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
                    {
                        path: '/forum',
                        loader: accountLoader,

                        element: <ForumPage />
                    },
                ]
            },
            {
                element: <RequireAdmin />,
                loader: userLoader,
                children: [
                    {
                        path:'/ressources/ajouter',
                        loader: accountLoader,
                        element: <ResourceFormulairePage />
                    },
                    {
                        path:'/ressources/:slug/modifier',
                        loader: accountLoader,
                        element: <ResourceFormulairePage />
                    }
                ]
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
    {
        element: <RequireAdmin />,
        loader: userLoader,
        children: [
            {
                path: '/admin',
                element: <AdminLayout />,
                loader: accountLoader,
                children: [
                    {
                        index: true,
                        element: <AdminDashboard />
                    },
                    {
                        path: 'users',
                        element: <UserManagement />
                    },
                    {
                        path: 'communications',
                        element: <BulkEmail />
                    },
                    {
                        element: <RequireSuperAdmin />,
                        children: [
                            {
                                path: 'roles',
                                element: <RoleManagement />
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        element: <RequireAdminOrModerator />,
        loader: userLoader,
        children: [
            {
                path: '/admin',
                element: <AdminLayout />,
                loader: accountLoader,
                children: [
                    {
                        path: 'moderation',
                        element: <ModerationPage />
                    }
                ]
            }
        ]
    },
]);

export default router
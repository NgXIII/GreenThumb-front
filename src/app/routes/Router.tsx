import { createBrowserRouter,  } from "react-router-dom"
import Layout from "../../shared/components/layout/Layout.tsx";
import ErrorPage from "../../pages/ErrorPage.tsx";
import HomePage from "../../pages/homePage/HomePage.tsx";
/*import DashboardPage from "../../pages/DashboardPage.tsx";
import CommunautePage from "../../pages/CommunautePage.tsx";
import RessourcesPage from "../../pages/RessourcesPage.tsx";
import ProfilPage from "../../pages/ProfilePage.tsx";*/

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                index: true,
                element: <HomePage/>
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
        ]
    }
])

export default router
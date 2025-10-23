import { createBrowserRouter,  } from "react-router-dom"
import Layout from "../../shared/components/layout/Layout.tsx";
import ErrorPage from "../../pages/ErrorPage.tsx";
import HomePage from "../../pages/HomePage.tsx";
import RegisterPage from "../../pages/RegisterPage.tsx";



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
        ],
    },
    {
        path: "/inscription",
        element: <RegisterPage />,
    },
]);

export default router
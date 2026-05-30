import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage"
import Category from "./pages/Category";
import Login from "./pages/login/login";
export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/categories",
        element: < Category />
    },
    {
        path: "/auth/login",
        element: <Login />
    }
]

)
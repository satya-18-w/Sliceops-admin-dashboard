import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage"
import Users from "./pages/users/Users"
import Category from "./pages/Category";
import Login from "./pages/login/login";
import Dashboard from "./layouts/Dashboard";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";
import Restaurants from "./pages/restaurants/Restaurants";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "",
                element: <Dashboard />,
                children: [
                    {
                        path: "/categories",
                        element: < Category />
                    },
                    {
                        path: "",
                        element: <HomePage />
                    },
                    {
                        path: "/users",
                        element: <Users />
                    },
                    {
                        path: "/restaurants",
                        element: <Restaurants />
                    },
                    // {
                    //     path: "/products",
                    //     element: <Products />
                    // },
                    // {
                    //     path: "/promos",
                    //     element: <Promos />
                    // },


                ]
            },
            {
                path: "/auth",
                element: <NonAuth />,
                children: [
                    {
                        path: "login",
                        element: <Login />
                    }
                ]
            },

        ]
    }



]

)
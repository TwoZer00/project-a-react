import { Typography } from "@mui/material";
import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home";
import Init from "../Pages/Init";
import Profile from "../Pages/Profile";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Init />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "profile",
                element: <Profile />,
                children: [{
                    path: ":id",
                    element: <Profile />
                }]
            }
        ]
    },
    {
        path: "/login",
        element: <Typography variant="h1" >Login</Typography>,
    }
]);
import { Typography } from "@mui/material";
import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home";
import Init from "../Pages/Init";
import Profile from "../Pages/Profile";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Upload from "../Pages/Upload";

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
                path: "user",
                element: <Profile />,
                children: [{
                    path: ":id",
                    element: <Profile />
                }]
            },
            {
                path: "upload",
                element: <Upload />
            }
        ]
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />
    }
]);
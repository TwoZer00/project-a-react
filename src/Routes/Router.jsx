import { Typography } from "@mui/material";
import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home";
import Init from "../Pages/Init";
import Profile from "../Pages/Profile";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Upload from "../Pages/Upload";
import Post from "../Pages/Post";
import { getPostData } from "../firebase/utills";
import { getAuth } from "firebase/auth";
import { app } from '../firebase/init';
import Settings from "../Pages/Settings";
import EditProfile from "../Pages/EditProfile";
import Preferences from "../Pages/Preferences";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Init />,
        loader: async () => {
            return getAuth(app)
        },
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
            },
            {
                path: "post/:id",
                element: <Post />,
                loader: async ({ params }) => {
                    return getPostData(params.id);
                }
            },
            {
                path: 'settings',
                element: <Settings />,
                children: [{
                    path: 'profile',
                    element: <EditProfile />
                }
                    ,
                {
                    path: 'preferences',
                    element: <Preferences />
                }
                ]
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
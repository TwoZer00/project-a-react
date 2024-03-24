import { getAuth } from "firebase/auth";
import { createBrowserRouter } from "react-router-dom";
import Categories from "../Pages/Categories";
import Category from "../Pages/Category";
import Dashboard from "../Pages/Dashboard";
import HomeDashboard from "../Pages/Dashboard/Home";
import PostListDashboard from "../Pages/Dashboard/Posts/List";
import DashboardPost from "../Pages/Dashboard/Posts/Post";
import ProfileDashboard from "../Pages/Dashboard/Profile/ProfileDashboard";
import EditProfile from "../Pages/EditProfile";
import Genre from "../Pages/Genre";
import Home from "../Pages/Home";
import Init from "../Pages/Init";
import Login from "../Pages/Login";
import Post from "../Pages/Post";
import Preferences from "../Pages/Preferences";
import Profile from "../Pages/Profile";
import Register from "../Pages/Register";
import Settings from "../Pages/Settings";
import Tags from "../Pages/Tags";
import Upload from "../Pages/Upload";
import { app } from '../firebase/init';
import { getCategories, getPostData } from "../firebase/utills";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Init />,
        loader: async () => {
            return getAuth(app)
        },
        errorElement: <Error />,
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
            },
            {
                path: "tags/:tags",
                element: <Tags />
            },
            {
                path: "genre/:genre",
                element: <Genre />
            },
            {
                path: "categories",
                element: <Categories />,
                loader: async () => {
                    return getCategories();
                },
                children: [
                    {
                        path: ":category",
                        element: <Category />
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
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
        loader: async () => {
            return getAuth(app);
        },
        children: [
            {
                path: "",
                element: <HomeDashboard />
            },
            {
                path: "post",
                element: <PostListDashboard />,
                children: [
                    {
                        path: ":id",
                        element: <DashboardPost />
                    }
                ]
            },
            {
                path: "profile",
                element: <ProfileDashboard />,
            }
        ]
    }
]);
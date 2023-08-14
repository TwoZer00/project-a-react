import { Typography } from "@mui/material";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Typography variant="h1" >Hello world</Typography>,
    }
]);
import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Login from "./views/Login";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout/>,
        children: [
            {
                index: true,
                element: <Login/>
            }
        ]
    }
])
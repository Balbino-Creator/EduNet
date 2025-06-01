import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Login from "./views/Login";
import Home from "./views/Home";
import Projects from "./views/Projects";
import LiveCode from "./views/LiveCode";
import Settings from "./views/Settings";
import RegisterTeacher from "./views/RegisterTeacher";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout/>,
        children: [
            {
                index: true,
                element: <Login/>
            },
            {
                path: 'home',
                element: <Home/>
            },
            {
                path: 'projects',
                element: <Projects/>
            },
            {
                path: 'live-code',
                element: <LiveCode/>
            },
            {
                path: 'settings',
                element: <Settings/>
            },
            {
                path: 'register-teacher',
                element: <RegisterTeacher/>
            }
        ]
    }
])
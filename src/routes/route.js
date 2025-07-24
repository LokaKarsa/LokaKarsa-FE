import { Dashboard } from "@/components/fragments/dashboard";
import AuthLayout from "@/components/layouts/AuthLayout";
import MainLayout from "@/components/layouts/MainLayout";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import Homepage from "@/pages/HomePage";
import AdvancedLessonPage from "@/pages/Lesson/AdvancedLessonPage";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: Homepage,
            },
            {
                path: "about"
            }
        ]
    },
    {
        path: "/auth",
        Component: AuthLayout,
        children: [
            {
                index: true,
                loader: () => redirect("/auth/login")
            },
            {
                path: "login",
                Component: LoginPage
            },
            {
                path: "register",
                Component: RegisterPage
            }
        ]
    },
    {
         path: "/dashboard",
        Component: Dashboard,
        children: [
            {
                index: true,
                Component: Homepage,
            }
        ]
    },
    {
        path: "/advanced",
        Component: AdvancedLessonPage,
        children: [
            {
                index: true,
                Component: Homepage,
            }
        ]
    }

    
    
])
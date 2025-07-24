import MainLayout from "@/components/layouts/MainLayout";
import Homepage from "@/pages/Homepage";
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
    }
])
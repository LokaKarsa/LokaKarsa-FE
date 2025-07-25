import { useAuth } from "@/provider/AuthProvider";
import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router";

const MainLayout = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const token = auth?.token;
    const user = auth?.user;
    const isLoading = auth?.isLoading;

    // Show loading state while auth is initializing
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Check if the user is authenticated
    if (!token || !user) {
        // If not authenticated, redirect to the login page
        return <Navigate to="/auth/login" />;
    }
    return (
        <>
            <Outlet />
        </>
    );
};

export default MainLayout;

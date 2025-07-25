import { useAuth } from "@/provider/AuthProvider";
import React from "react";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children, fallback = "/auth/login" }) => {
    const { token, user, isLoading } = useAuth();

    // Show loading state while auth is initializing
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Memuat...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, redirect to fallback (usually login)
    if (!token || !user) {
        return <Navigate to={fallback} replace />;
    }

    // If authenticated, render the protected content
    return children;
};

export default ProtectedRoute;

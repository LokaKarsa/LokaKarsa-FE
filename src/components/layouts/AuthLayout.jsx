import { useAuth } from "@/provider/AuthProvider";
import { Navigate, Outlet } from "react-router";

const AuthLayout = () => {
    const auth = useAuth();
    const token = auth?.token;
    const user = auth?.user;
    const isLoading = auth?.isLoading;

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

    if (token && user) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <Outlet />
        </>
    );
};

export default AuthLayout;

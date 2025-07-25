import { useAuth } from "@/provider/AuthProvider";
import { useState } from "react";
import { Navigate, Outlet } from "react-router";

const AuthLayout = () => {
    const auth = useAuth();
    const token = auth?.token;
    const user = auth?.user;

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
import { fetchProfile } from "@/hooks/api/auth";
import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(undefined);

const AuthProvider = ({ children }) => {
    const [token, setToken_] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const setToken = (newToken) => {
        setToken_(newToken);
    };

    // refresh user profile function
    const refreshUserProfile = async () => {
        if (token) {
            try {
                axios.defaults.headers.common["Authorization"] =
                    "Bearer " + token;
                const response = await fetchProfile(token);
                console.log("Refreshed user profile:", response);
                console.log("User data:", response.data);
                setUser(response.data);
            } catch (error) {
                console.error("Failed to refresh user profile:", error);
                setToken(null); // Clear token if validation fails
                setUser(null);
            }
        }
        setIsLoading(false);
    };

    const resetContext = () => {
        setToken(null);
        setUser(null);
        setIsLoading(false);
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (token) {
                try {
                    axios.defaults.headers.common["Authorization"] =
                        "Bearer " + token;
                    localStorage.setItem("token", token);

                    const response = await fetchProfile(token);
                    console.log("Fetched user profile:", response);

                    setUser(response.data.user_info);
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                    setToken(null); // Clear token if validation fails
                    setUser(null);
                } finally {
                    setIsLoading(false);
                }
            } else {
                delete axios.defaults.headers.common["Authorization"];
                localStorage.removeItem("token");
                setUser(null);
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [token]);

    const contextValue = useMemo(
        () => ({
            token,
            user,
            isLoading,
            setToken,
            refreshUserProfile,
            resetContext,
        }),
        [token, user, isLoading]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;

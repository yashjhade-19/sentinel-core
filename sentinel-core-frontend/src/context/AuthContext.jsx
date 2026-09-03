import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { setTokens } from "../api/axiosConfig";

const AuthContext = createContext(null);

function readRoles(token) {
    if (!token) return [];

    try {
        const decoded = jwtDecode(token);
        return Array.isArray(decoded.roles) ? decoded.roles : [];
    } catch {
        return [];
    }
}

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(
        () => localStorage.getItem("accessToken")
    );
    const [refreshToken, setRefreshToken] = useState(
        () => localStorage.getItem("refreshToken")
    );
    const [roles, setRoles] = useState(
        () => readRoles(localStorage.getItem("accessToken"))
    );

    useEffect(() => {
        setTokens(accessToken, refreshToken);
    }, [accessToken, refreshToken]);

    useEffect(() => {
        const handleLogout = () => {
            setAccessToken(null);
            setRefreshToken(null);
            setRoles([]);
        };

        window.addEventListener("auth:logout", handleLogout);
        return () => window.removeEventListener("auth:logout", handleLogout);
    }, []);

    const loginUser = (access, refresh) => {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        try {
            localStorage.setItem("username", jwtDecode(access).sub || "");
        } catch {
            localStorage.removeItem("username");
        }
        setAccessToken(access);
        setRefreshToken(refresh);
        setRoles(readRoles(access));
        setTokens(access, refresh);
    };

    const updateAccessToken = (newAccessToken) => {
        localStorage.setItem("accessToken", newAccessToken);
        setAccessToken(newAccessToken);
        setRoles(readRoles(newAccessToken));
        setTokens(newAccessToken, refreshToken);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        setAccessToken(null);
        setRefreshToken(null);
        setRoles([]);
        setTokens(null, null);
    };

    const value = useMemo(() => ({
        accessToken,
        refreshToken,
        roles,
        isAdmin: roles.includes("ROLE_ADMIN"),
        loginUser,
        updateAccessToken,
        logout
    }), [accessToken, refreshToken, roles]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

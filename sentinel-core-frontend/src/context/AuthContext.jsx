import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { setTokens } from "../api/axiosConfig";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [accessToken, setAccessToken] = useState(
        () => localStorage.getItem("accessToken")
    );

    const [refreshToken, setRefreshToken] = useState(
        () => localStorage.getItem("refreshToken")
    );

    const [roles, setRoles] = useState(() => {
        const token = localStorage.getItem("accessToken");

        if (!token) return [];

        try {
            const decoded = jwtDecode(token);
            return decoded.roles || [];
        } catch {
            return [];
        }
    });

    // Restore tokens into axios when app starts
    if (accessToken || refreshToken) {
        setTokens(accessToken, refreshToken);
    }

    const loginUser = (access, refresh) => {

        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);

        setAccessToken(access);
        setRefreshToken(refresh);

        setTokens(access, refresh);

        const decoded = jwtDecode(access);
        setRoles(decoded.roles || []);
    };

    const updateAccessToken = (newAccessToken) => {

        localStorage.setItem("accessToken", newAccessToken);

        setAccessToken(newAccessToken);

        setTokens(newAccessToken, refreshToken);

        const decoded = jwtDecode(newAccessToken);
        setRoles(decoded.roles || []);
    };

    const logout = () => {

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setAccessToken(null);
        setRefreshToken(null);
        setRoles([]);

        setTokens(null, null);
    };

    const isAdmin = roles.includes("ROLE_ADMIN");

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                roles,
                isAdmin,
                loginUser,
                updateAccessToken,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
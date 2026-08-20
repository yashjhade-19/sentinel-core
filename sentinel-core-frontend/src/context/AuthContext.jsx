import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [roles, setRoles] = useState([]);

    const loginUser = (access, refresh) => {

        setAccessToken(access);
        setRefreshToken(refresh);

        const decoded = jwtDecode(access);

        setRoles(decoded.roles || []);
    };

    const updateAccessToken = (newAccessToken) => {

        setAccessToken(newAccessToken);

        const decoded = jwtDecode(newAccessToken);

        setRoles(decoded.roles || []);
    };

    const logout = () => {

        setAccessToken(null);
        setRefreshToken(null);
        setRoles([]);
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
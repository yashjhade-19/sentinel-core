import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { setTokens } from "./api/axiosConfig";

function AppContent() {

    const { accessToken, loginUser, logout } = useAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(!!accessToken);

    const handleLoginSuccess = (accessToken, refreshToken) => {

        loginUser(accessToken, refreshToken);

        setTokens(accessToken, refreshToken);

        setIsLoggedIn(true);
    };

    const handleLogout = () => {

        logout();

        setTokens(null, null);

        setIsLoggedIn(false);
    };

    if (!isLoggedIn) {
        return (
            <Login onLoginSuccess={handleLoginSuccess} />
        );
    }

    return (
        <Dashboard onLogout={handleLogout} />
    );
}

function App() {

    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
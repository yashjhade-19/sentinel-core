import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Alerts from "./pages/Alerts";
import Incidents from "./pages/Incidents";
import Vulnerabilities from "./pages/Vulnerabilities";
import AuditLogs from "./pages/AuditLogs";
import Compliance from "./pages/Compliance";

function ProtectedRoutes() {
    const { accessToken } = useAuth();

    if (!accessToken) return <Navigate to="/login" replace />;

    return (
        <AppLayout>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/assets" element={<Assets />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/incidents" element={<Incidents />} />
                <Route path="/vulnerabilities" element={<Vulnerabilities />} />
                <Route path="/audit" element={<AuditLogs />} />
                <Route path="/compliance" element={<Compliance />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </AppLayout>
    );
}

function AppRoutes() {
    const { accessToken } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={accessToken ? <Navigate to="/dashboard" replace /> : <Login />}
            />
            <Route
                path="/register"
                element={accessToken ? <Navigate to="/dashboard" replace /> : <Register />}
            />
            <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;

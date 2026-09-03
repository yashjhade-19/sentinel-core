import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AppLayout.css";

const navigation = [
    { to: "/dashboard", label: "Dashboard", icon: "▦" },
    { to: "/assets", label: "Assets", icon: "◉" },
    { to: "/alerts", label: "Alerts", icon: "△" }
];

function AppLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { roles, logout } = useAuth();

    const username = localStorage.getItem("username") || "admin";
    const roleLabel = roles.includes("ROLE_ADMIN") ? "Administrator" : "Viewer";

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="brand-block">
                    <div className="brand-icon">S</div>
                    <div>
                        <div className="brand-name">SentinelCore</div>
                        <div className="brand-caption">Security Platform</div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? "active" : ""}`
                            }
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="system-status">
                        <span className="status-dot online-dot" />
                        <span>System Online</span>
                    </div>
                    <small>SentinelCore v1.0</small>
                </div>
            </aside>

            <div className="app-main">
                <header className="topbar">
                    <div className="topbar-title">
                        <strong>SentinelCore</strong>
                        <span>Security Operations</span>
                    </div>

                    <div className="topbar-actions">
                        <div className="operational">
                            <span className="status-dot online-dot" />
                            Operational
                        </div>
                        <div className="topbar-divider" />
                        <div className="profile-block">
                            <div className="profile-avatar">
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <strong>{username}</strong>
                                <small>{roleLabel}</small>
                            </div>
                        </div>
                        <button
                            className="logout-button"
                            onClick={handleLogout}
                            title="Logout"
                            aria-label="Logout"
                        >
                            ↪
                        </button>
                    </div>
                </header>

                <main className={`page-content ${location.pathname.slice(1)}`}>
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AppLayout;

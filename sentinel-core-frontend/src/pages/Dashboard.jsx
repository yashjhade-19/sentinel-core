import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardSummary, getAllAssets } from "../api/assetApi";
import { getOpenAlerts } from "../api/alertApi";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const number = (value, digits = 1) => Number(value ?? 0).toFixed(digits);

function Dashboard() {
    const { isAdmin } = useAuth();
    const [summary, setSummary] = useState(null);
    const [assets, setAssets] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = useCallback(async () => {
        setError("");
        try {
            const [summaryRes, assetsRes, alertsRes] = await Promise.all([
                getDashboardSummary(),
                getAllAssets(),
                getOpenAlerts()
            ]);
            setSummary(summaryRes.data);
            setAssets(Array.isArray(assetsRes.data) ? assetsRes.data : []);
            setAlerts(Array.isArray(alertsRes.data) ? alertsRes.data : []);
        } catch (err) {
            console.error("Dashboard load failed:", err);
            setError("Unable to load dashboard data. Please refresh.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadDashboard(); }, [loadDashboard]);

    if (loading) return <div className="page-loading">Loading dashboard...</div>;

    const visibleAssets = assets.slice(0, 5);
    const visibleAlerts = alerts.slice(0, 4);

    return (
        <div className="dashboard-page">
            <div className="page-heading-row">
                <div>
                    <div className="eyebrow">OVERVIEW</div>
                    <h1>Security Dashboard</h1>
                    <p>Monitor infrastructure health, asset availability and security alerts.</p>
                </div>
                <button className="secondary-button" onClick={loadDashboard}>↻ Refresh</button>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <section className="summary-grid">
                <div className="summary-card"><span>Total Assets</span><strong>{summary?.totalAssets ?? 0}</strong><small>Registered infrastructure</small></div>
                <div className="summary-card"><span>Online Assets</span><strong>{summary?.onlineAssets ?? 0}</strong><small>Currently operational</small></div>
                <div className="summary-card"><span>Offline Assets</span><strong>{summary?.offlineAssets ?? 0}</strong><small>Currently unavailable</small></div>
                <div className="summary-card critical"><span>Critical Alerts</span><strong>{summary?.criticalAlerts ?? 0}</strong><small>Require attention</small></div>
            </section>

            <section className="health-card">
                <div className="section-title-row">
                    <div><h2>System Health</h2><p>Current infrastructure performance</p></div>
                    <span className="live-badge">LIVE</span>
                </div>
                <div className="health-grid">
                    <HealthMetric label="System Uptime" value={number(summary?.uptimePercentage)} note="Asset availability" />
                    <HealthMetric label="Average CPU" value={number(summary?.avgCpuUsage)} note="Across monitored assets" />
                    <HealthMetric label="Average Memory" value={number(summary?.avgMemoryUsage)} note="Across monitored assets" />
                </div>
            </section>

            <div className="dashboard-lower-grid">
                <section className="panel">
                    <div className="section-title-row">
                        <div><h2>Recent Assets</h2><p>Latest monitored infrastructure</p></div>
                        <Link to="/assets" className="view-link">View all →</Link>
                    </div>
                    <div className="mini-table">
                        <div className="mini-row mini-head"><span>ASSET</span><span>STATUS</span><span>CPU</span><span>MEMORY</span></div>
                        {visibleAssets.length === 0 ? <div className="empty-row">No assets found.</div> : visibleAssets.map(asset => (
                            <div className="mini-row" key={asset.id}>
                                <div><strong>{asset.assetName}</strong><small>{asset.assetType}</small></div>
                                <StatusBadge status={asset.status} />
                                <span>{number(asset.cpuUsage)}%</span>
                                <span>{number(asset.memoryUsage)}%</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="panel">
                    <div className="section-title-row">
                        <div><h2>Open Alerts</h2><p>Security events requiring attention</p></div>
                        <Link to="/alerts" className="view-link">View all →</Link>
                    </div>
                    <div className="alert-list">
                        {visibleAlerts.length === 0 ? <div className="empty-row">No open alerts.</div> : visibleAlerts.map(alert => (
                            <div className="alert-item" key={alert.id}>
                                <span className={`severity ${alert.severity?.toLowerCase()}`}>{alert.severity}</span>
                                <div><strong>{alert.assetName}</strong><small>{alert.message}</small></div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {isAdmin && <div className="dashboard-note">Administrator access enabled — asset management is available from the Assets section.</div>}
        </div>
    );
}

function HealthMetric({ label, value, note }) {
    const percentage = Math.max(0, Math.min(100, Number(value)));
    return <div className="health-metric"><div className="metric-top"><span>{label}</span><strong>{value}%</strong></div><div className="progress"><span style={{ width: `${percentage}%` }} /></div><small>{note}</small></div>;
}

function StatusBadge({ status }) {
    const value = status || "UNKNOWN";
    return <span className={`status-badge ${value.toLowerCase()}`}><i />{value}</span>;
}

export default Dashboard;

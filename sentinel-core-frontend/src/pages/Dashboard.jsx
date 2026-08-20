import { useEffect, useState } from "react";
import AssetTable from "../components/AssetTable";
import {
    getAllAssets,
    getDashboardSummary,
    createAsset
} from "../api/assetApi";

import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {

    const { isAdmin } = useAuth();

    const [assets, setAssets] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        assetName: "",
        assetType: "",
        ipAddress: "",
        location: "",
        status: "ONLINE",
        cpuUsage: "",
        memoryUsage: "",
        networkUsage: ""
    });

    const loadDashboard = async () => {
        try {
            const [assetsResponse, summaryResponse] =
                await Promise.all([
                    getAllAssets(),
                    getDashboardSummary()
                ]);

            setAssets(assetsResponse.data);
            setSummary(summaryResponse.data);

        } catch (error) {
            console.error("Error loading dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {

            await createAsset({
                ...formData,
                cpuUsage: Number(formData.cpuUsage),
                memoryUsage: Number(formData.memoryUsage),
                networkUsage: Number(formData.networkUsage)
            });

            setFormData({
                assetName: "",
                assetType: "",
                ipAddress: "",
                location: "",
                status: "ONLINE",
                cpuUsage: "",
                memoryUsage: "",
                networkUsage: ""
            });

            setShowForm(false);

            await loadDashboard();

        } catch (error) {
            console.error("Error creating asset:", error);
            alert("Failed to create asset");
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div className="dashboard-layout">

            {/* Sidebar */}

            <aside className="sidebar">

                <div className="sidebar-logo">
                    <div className="logo-icon">S</div>
                    <span>SentinelCore</span>
                </div>

                <nav className="sidebar-nav">

                    <div className="nav-item active">
                        <span className="nav-icon">▦</span>
                        <span>Dashboard</span>
                    </div>

                </nav>

            </aside>


            {/* Main */}

            <main className="dashboard-main">

                <header className="dashboard-header">

                    <div>
                        <h1>Dashboard</h1>
                        <p>
                            Monitor and manage infrastructure assets.
                        </p>
                    </div>

                    {isAdmin && (
                        <button
                            className="add-asset-button"
                            onClick={() => setShowForm(true)}
                        >
                            <span>+</span>
                            Add Asset
                        </button>
                    )}

                </header>


                {/* Summary */}

                {summary && (
                    <section className="summary-grid">

                        <div className="summary-card">
                            <span>Total Assets</span>
                            <strong>
                                {summary.totalAssets}
                            </strong>
                        </div>

                        <div className="summary-card">
                            <span>Uptime</span>
                            <strong>
                                {summary.uptimePercentage.toFixed(2)}%
                            </strong>
                        </div>

                        <div className="summary-card">
                            <span>Avg CPU Usage</span>
                            <strong>
                                {summary.avgCpuUsage.toFixed(1)}%
                            </strong>
                        </div>

                        <div className="summary-card">
                            <span>Avg Memory Usage</span>
                            <strong>
                                {summary.avgMemoryUsage.toFixed(1)}%
                            </strong>
                        </div>

                        <div className="summary-card">
                            <span>Critical Alerts</span>
                            <strong className="critical-number">
                                {summary.criticalAlerts}
                            </strong>
                        </div>

                    </section>
                )}


                {/* Assets */}

                <section className="assets-section">

                    <div className="section-header">

                        <div>
                            <h2>Assets</h2>
                            <span>
                                {assets.length} assets
                            </span>
                        </div>

                    </div>

                    <AssetTable assets={assets} />

                </section>

            </main>


            {/* Add Asset Modal */}

          {showForm && isAdmin && (

                <div
                    className="modal-overlay"
                    onClick={() => setShowForm(false)}
                >

                    <div
                        className="asset-modal"
                        onClick={(event) => event.stopPropagation()}
                    >

                        <div className="modal-header">

                            <div>
                                <h2>Add Asset</h2>
                                <p>
                                    Enter the asset details below.
                                </p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setShowForm(false)}
                            >
                                ×
                            </button>

                        </div>


                        <form onSubmit={handleSubmit}>

                            <div className="form-grid">

                                <div className="form-group">
                                    <label>Asset Name</label>
                                    <input
                                        type="text"
                                        name="assetName"
                                        value={formData.assetName}
                                        onChange={handleChange}
                                        placeholder="e.g. WebServer-01"
                                        required
                                    />
                                </div>


                                <div className="form-group">
                                    <label>Asset Type</label>
                                    <input
                                        type="text"
                                        name="assetType"
                                        value={formData.assetType}
                                        onChange={handleChange}
                                        placeholder="e.g. Server"
                                        required
                                    />
                                </div>


                                <div className="form-group">
                                    <label>IP Address</label>
                                    <input
                                        type="text"
                                        name="ipAddress"
                                        value={formData.ipAddress}
                                        onChange={handleChange}
                                        placeholder="192.168.1.10"
                                        required
                                    />
                                </div>


                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Indore"
                                        required
                                    />
                                </div>


                                <div className="form-group">
                                    <label>Status</label>

                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="ONLINE">
                                            ONLINE
                                        </option>

                                        <option value="WARNING">
                                            WARNING
                                        </option>

                                        <option value="CRITICAL">
                                            CRITICAL
                                        </option>
                                    </select>

                                </div>


                                <div className="form-group">
                                    <label>CPU Usage (%)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        name="cpuUsage"
                                        value={formData.cpuUsage}
                                        onChange={handleChange}
                                        placeholder="45.2"
                                        required
                                    />
                                </div>


                                <div className="form-group">
                                    <label>Memory Usage (%)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        name="memoryUsage"
                                        value={formData.memoryUsage}
                                        onChange={handleChange}
                                        placeholder="60.1"
                                        required
                                    />
                                </div>


                                <div className="form-group">
                                    <label>Network Usage (%)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        name="networkUsage"
                                        value={formData.networkUsage}
                                        onChange={handleChange}
                                        placeholder="30.2"
                                        required
                                    />
                                </div>

                            </div>


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-button"
                                >
                                    Add Asset
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Dashboard;
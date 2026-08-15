import { useEffect, useState } from "react";
import AssetTable from "../components/AssetTable";
import { getAllAssets } from "../api/assetApi";
import "./Dashboard.css";

function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAssets = async () => {
    try {
      setLoading(true);

      const response = await getAllAssets();
      setAssets(response.data);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleAddAsset = () => {
    // Form will be connected here next
    console.log("Add Asset clicked");
  };

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

      {/* Main Content */}
      <main className="dashboard-main">

        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Monitor and manage your infrastructure assets.</p>
          </div>
        </header>

        <section className="assets-section">

          <div className="section-header">
            <div>
              <h2>Assets</h2>
              <span className="asset-count">
                {assets.length} {assets.length === 1 ? "asset" : "assets"}
              </span>
            </div>

            <button
              className="add-asset-button"
              onClick={handleAddAsset}
            >
              <span className="plus-icon">+</span>
              Add Asset
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
              <span>Loading assets...</span>
            </div>
          ) : (
            <AssetTable assets={assets} />
          )}

        </section>

      </main>
    </div>
  );
}

export default Dashboard;
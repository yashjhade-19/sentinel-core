import { useCallback, useEffect, useState } from "react";
import AssetTable from "../components/AssetTable";
import { createAsset, searchAssets } from "../api/assetApi";
import { useAuth } from "../context/AuthContext";
import "./Assets.css";

const emptyForm = {
    assetName: "", assetType: "", ipAddress: "", location: "",
    status: "ONLINE", risk: "LOW", cpuUsage: "", memoryUsage: "", diskUsage: "", networkUsage: ""
};

function Assets() {
    const { isAdmin } = useAuth();
    const [assets, setAssets] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [risk, setRisk] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const loadAssets = useCallback(async () => {
        setLoading(true); setError("");
        try {
            const response = await searchAssets({ search, status, risk });
            setAssets(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Asset search failed:", err);
            setError("Unable to load assets.");
        } finally { setLoading(false); }
    }, [search, status, risk]);

    useEffect(() => {
        const timer = setTimeout(loadAssets, 300);
        return () => clearTimeout(timer);
    }, [loadAssets]);

    const handleChange = (event) => setForm(prev => ({ ...prev, [event.target.name]: event.target.value }));

    const handleSubmit = async (event) => {
        event.preventDefault(); setSaving(true); setError("");
        try {
            await createAsset({
                ...form,
                cpuUsage: Number(form.cpuUsage),
                memoryUsage: Number(form.memoryUsage),
                diskUsage: form.diskUsage === "" ? null : Number(form.diskUsage),
                networkUsage: Number(form.networkUsage)
            });
            setForm(emptyForm); setShowForm(false); await loadAssets();
        } catch (err) {
            console.error("Create asset failed:", err);
            setError(err.response?.data?.message || "Failed to create asset.");
        } finally { setSaving(false); }
    };

    const clearFilters = () => { setSearch(""); setStatus(""); setRisk(""); };

    return (
        <div className="assets-page">
            <div className="page-heading-row">
                <div><div className="eyebrow">INFRASTRUCTURE</div><h1>Assets</h1><p>Monitor and manage registered infrastructure.</p></div>
                {isAdmin && <button className="primary-button" onClick={() => setShowForm(true)}>＋ Add Asset</button>}
            </div>

            {error && <div className="error-banner">{error}</div>}

            <section className="asset-toolbar">
                <div className="search-box"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets, IP address or location..." /></div>
                <select value={status} onChange={e => setStatus(e.target.value)}><option value="">All Status</option><option value="ONLINE">Online</option><option value="WARNING">Warning</option><option value="CRITICAL">Critical</option><option value="OFFLINE">Offline</option></select>
                <select value={risk} onChange={e => setRisk(e.target.value)}><option value="">All Risk</option><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option></select>
                {(search || status || risk) && <button className="clear-button" onClick={clearFilters}>Clear</button>}
            </section>

            <section className="assets-panel">
                <div className="panel-heading"><div><h2>Asset Inventory</h2><span>{loading ? "Loading..." : `${assets.length} asset${assets.length === 1 ? "" : "s"}`}</span></div><button className="refresh-small" onClick={loadAssets}>↻ Refresh</button></div>
                {loading ? <div className="asset-loading">Loading assets...</div> : <AssetTable assets={assets} />}
            </section>

            {showForm && isAdmin && <div className="modal-overlay" onMouseDown={() => setShowForm(false)}><div className="asset-modal" onMouseDown={e => e.stopPropagation()}>
                <div className="modal-header"><div><h2>Add Asset</h2><p>Register infrastructure for monitoring.</p></div><button className="modal-close" onClick={() => setShowForm(false)}>×</button></div>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <Field label="Asset Name" name="assetName" value={form.assetName} onChange={handleChange} placeholder="WebServer-01" required />
                        <Field label="Asset Type" name="assetType" value={form.assetType} onChange={handleChange} placeholder="Server" required />
                        <Field label="IP Address" name="ipAddress" value={form.ipAddress} onChange={handleChange} placeholder="192.168.1.10" required />
                        <Field label="Location" name="location" value={form.location} onChange={handleChange} placeholder="Indore" required />
                        <SelectField label="Status" name="status" value={form.status} onChange={handleChange} options={["ONLINE","WARNING","CRITICAL","OFFLINE"]} />
                        <SelectField label="Risk" name="risk" value={form.risk} onChange={handleChange} options={["LOW","MEDIUM","HIGH","CRITICAL"]} />
                        <NumberField label="CPU Usage (%)" name="cpuUsage" value={form.cpuUsage} onChange={handleChange} required />
                        <NumberField label="Memory Usage (%)" name="memoryUsage" value={form.memoryUsage} onChange={handleChange} required />
                        <NumberField label="Disk Usage (%)" name="diskUsage" value={form.diskUsage} onChange={handleChange} />
                        <NumberField label="Network Usage (%)" name="networkUsage" value={form.networkUsage} onChange={handleChange} required />
                    </div>
                    <div className="modal-actions"><button type="button" className="cancel-button" onClick={() => setShowForm(false)}>Cancel</button><button className="save-button" disabled={saving}>{saving ? "Adding..." : "Add Asset"}</button></div>
                </form>
            </div></div>}
        </div>
    );
}

function Field({ label, ...props }) { return <div className="form-group"><label>{label}</label><input {...props} /></div>; }
function NumberField({ label, ...props }) { return <Field label={label} type="number" min="0" max="100" step="0.1" {...props} />; }
function SelectField({ label, options, ...props }) { return <div className="form-group"><label>{label}</label><select {...props}>{options.map(o => <option key={o} value={o}>{o}</option>)}</select></div>; }

export default Assets;

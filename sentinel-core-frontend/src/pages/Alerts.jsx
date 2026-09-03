import { useCallback, useEffect, useState } from "react";
import { getOpenAlerts, resolveAlert } from "../api/alertApi";
import "./Alerts.css";

function Alerts() {
    const [alerts, setAlerts] = useState([]);
    const [severity, setSeverity] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAlerts = useCallback(async () => {
        setLoading(true); setError("");
        try {
            const response = await getOpenAlerts();
            setAlerts(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Alert load failed:", err);
            setError("Unable to load alerts.");
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { loadAlerts(); }, [loadAlerts]);

    const handleResolve = async (id) => {
        try { await resolveAlert(id); await loadAlerts(); }
        catch (err) { console.error(err); setError("Unable to resolve alert."); }
    };

    const filtered = severity ? alerts.filter(a => a.severity === severity) : alerts;
    const critical = alerts.filter(a => a.severity === "CRITICAL").length;
    const high = alerts.filter(a => a.severity === "HIGH").length;

    return <div className="alerts-page">
        <div className="page-heading-row"><div><div className="eyebrow">SECURITY EVENTS</div><h1>Alerts</h1><p>Review and manage active infrastructure alerts.</p></div><button className="secondary-button" onClick={loadAlerts}>↻ Refresh</button></div>
        {error && <div className="error-banner">{error}</div>}
        <div className="alert-summary"><Summary label="Open Alerts" value={alerts.length} /><Summary label="Critical" value={critical} critical /><Summary label="High" value={high} high /></div>
        <section className="alerts-panel"><div className="panel-heading"><div><h2>Active Alerts</h2><span>{filtered.length} displayed</span></div><select value={severity} onChange={e => setSeverity(e.target.value)}><option value="">All Severity</option><option value="CRITICAL">Critical</option><option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option></select></div>
            {loading ? <div className="alert-loading">Loading alerts...</div> : filtered.length === 0 ? <div className="alert-empty">No open alerts.</div> : <div>{filtered.map(alert => <div className="alert-row" key={alert.id}><span className={`severity-pill ${alert.severity?.toLowerCase()}`}>{alert.severity}</span><div className="alert-info"><strong>{alert.assetName}</strong><span>#{alert.id}</span><p>{alert.message}</p><small>{formatDate(alert.createdAt)}</small></div><div className="alert-actions"><span className="open-pill">OPEN</span><button onClick={() => handleResolve(alert.id)}>Resolve</button></div></div>)}</div>}
        </section>
    </div>;
}
function Summary({label,value,critical,high}){return <div className={`alert-summary-card ${critical?"critical":""} ${high?"high":""}`}><span>{label}</span><strong>{value}</strong></div>}
function formatDate(value){if(!value)return "";const date=new Date(value);return Number.isNaN(date.getTime())?value:date.toLocaleString();}
export default Alerts;

import { useEffect, useState } from "react";
import { createIncident, getIncidents, updateIncidentStatus } from "../api/securityOpsApi";
import "./SecurityModule.css";

const emptyForm = { title: "", description: "", severity: "MEDIUM", assignedTo: "admin" };
const badge = (value) => `badge ${(value || "").toLowerCase()}`;

export default function Incidents() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const load = async () => {
        setError("");
        try { setItems((await getIncidents()).data || []); }
        catch (e) { console.error(e); setError("Unable to load incidents."); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const submit = async (e) => {
        e.preventDefault(); setSaving(true); setError("");
        try { await createIncident(form); setForm(emptyForm); setShowForm(false); await load(); }
        catch (e) { console.error(e); setError("Unable to create incident."); }
        finally { setSaving(false); }
    };

    const resolve = async (id) => {
        try { await updateIncidentStatus(id, "RESOLVED"); await load(); }
        catch (e) { console.error(e); setError("Unable to update incident."); }
    };

    return <div className="module-page">
        <div className="module-heading"><div><div className="eyebrow">SECURITY OPERATIONS</div><h1>Incidents</h1><p>Track, assign and resolve security incidents.</p></div><div className="module-actions"><button className="module-button secondary" onClick={load}>↻ Refresh</button><button className="module-button" onClick={() => setShowForm(v => !v)}>+ New Incident</button></div></div>
        {error && <div className="module-error">{error}</div>}
        {showForm && <form className="module-card module-form" onSubmit={submit}>
            <div className="module-field"><label>Title</label><input required value={form.title} onChange={e => setForm({...form,title:e.target.value})} placeholder="Suspicious Login" /></div>
            <div className="module-field"><label>Severity</label><select value={form.severity} onChange={e => setForm({...form,severity:e.target.value})}>{["LOW","MEDIUM","HIGH","CRITICAL"].map(x=><option key={x}>{x}</option>)}</select></div>
            <div className="module-field full"><label>Description</label><textarea value={form.description} onChange={e => setForm({...form,description:e.target.value})} placeholder="Describe the security event..." /></div>
            <div className="module-field"><label>Assigned To</label><input value={form.assignedTo} onChange={e => setForm({...form,assignedTo:e.target.value})} /></div>
            <div className="form-submit"><button className="module-button" disabled={saving}>{saving ? "Creating..." : "Create Incident"}</button></div>
        </form>}
        <div className="module-card"><div className="module-toolbar"><div><h2>Incident Queue</h2><span className="module-count">{items.length} incidents</span></div></div>
            <div className="module-table-wrap"><table className="module-table"><thead><tr><th>TITLE</th><th>SEVERITY</th><th>STATUS</th><th>ASSIGNED TO</th><th>CREATED</th><th>ACTION</th></tr></thead><tbody>
                {loading ? <tr><td colSpan="6" className="empty-module">Loading incidents...</td></tr> : items.length===0 ? <tr><td colSpan="6" className="empty-module">No incidents found.</td></tr> : items.map(x=><tr key={x.id}><td><strong>{x.title}</strong><br/><span>{x.description || "—"}</span></td><td><span className={badge(x.severity)}>{x.severity}</span></td><td><span className={badge(x.status)}>{x.status?.replace("_"," ")}</span></td><td>{x.assignedTo || "Unassigned"}</td><td>{x.createdAt ? new Date(x.createdAt).toLocaleString() : "—"}</td><td>{x.status !== "RESOLVED" && x.status !== "CLOSED" ? <button className="inline-action" onClick={() => resolve(x.id)}>Resolve</button> : "—"}</td></tr>)}
            </tbody></table></div>
        </div>
    </div>;
}

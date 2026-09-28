import { useEffect, useState } from "react";
import { getAuditLogs } from "../api/securityOpsApi";
import "./SecurityModule.css";

export default function AuditLogs(){
 const [items,setItems]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 const load=async()=>{setError("");try{setItems((await getAuditLogs()).data||[])}catch(e){console.error(e);setError("Unable to load audit logs.")}finally{setLoading(false)}};
 useEffect(()=>{load()},[]);
 return <div className="module-page"><div className="module-heading"><div><div className="eyebrow">GOVERNANCE</div><h1>Audit Logs</h1><p>Review security actions and access activity.</p></div><button className="module-button secondary" onClick={load}>↻ Refresh</button></div>{error&&<div className="module-error">{error}</div>}<div className="module-card"><div className="module-toolbar"><div><h2>Audit Trail</h2><span className="module-count">{items.length} records</span></div></div><div className="module-table-wrap"><table className="module-table"><thead><tr><th>TIME</th><th>USER</th><th>ACTION</th><th>RESOURCE</th><th>IP ADDRESS</th><th>DETAILS</th></tr></thead><tbody>{loading?<tr><td colSpan="6" className="empty-module">Loading audit logs...</td></tr>:items.length===0?<tr><td colSpan="6" className="empty-module">No audit records found.</td></tr>:items.map(x=><tr key={x.id}><td>{x.createdAt?new Date(x.createdAt).toLocaleString():"—"}</td><td><strong>{x.username||"—"}</strong></td><td>{x.action||"—"}</td><td>{x.resource||"—"}</td><td>{x.ipAddress||"—"}</td><td>{x.details||"—"}</td></tr>)}</tbody></table></div></div></div>;
}

import api from "./axiosConfig";

export const getIncidents = () => api.get("/incidents");
export const createIncident = (data) => api.post("/incidents", data);
export const assignIncident = (id, user) => api.put(`/incidents/${id}/assign`, null, { params: { user } });
export const updateIncidentStatus = (id, status) => api.put(`/incidents/${id}/status`, null, { params: { status } });
export const deleteIncident = (id) => api.delete(`/incidents/${id}`);

export const getVulnerabilities = () => api.get("/vulnerabilities");
export const createVulnerability = (data) => api.post("/vulnerabilities", data);
export const markVulnerabilityPatched = (id) => api.put(`/vulnerabilities/${id}/patch`);

export const getAuditLogs = () => api.get("/audit");
export const createAuditLog = (data) => api.post("/audit", data);

export const getComplianceChecks = () => api.get("/compliance");
export const createComplianceCheck = (data) => api.post("/compliance", data);

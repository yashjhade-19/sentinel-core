import api from "./axiosConfig";

export const getOpenAlerts = () => api.get("/alerts/open");

export const resolveAlert = (id) => api.put(`/alerts/${id}/resolve`);

export const createAlert = (assetId, severity, message) =>
    api.post("/alerts", null, {
        params: { assetId, severity, message }
    });

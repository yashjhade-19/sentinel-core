import api from "./axiosConfig";

const API_BASE = "/assets";

export const getAllAssets = () => api.get(API_BASE);

export const getAssetById = (id) => api.get(`${API_BASE}/${id}`);

export const createAsset = (asset) => api.post(API_BASE, asset);

export const updateAsset = (id, asset) => api.put(`${API_BASE}/${id}`, asset);

export const searchAssets = ({ search = "", status = "", risk = "" } = {}) =>
    api.get(`${API_BASE}/search`, {
        params: { search, status, risk }
    });

export const getDashboardSummary = () =>
    api.get(`${API_BASE}/dashboard/summary`);

import api from "./axiosConfig";

const API_BASE = "/assets";

export const getAllAssets = () => {
    return api.get(API_BASE);
};

export const getAssetById = (id) => {
    return api.get(`${API_BASE}/${id}`);
};

export const createAsset = (asset) => {
    return api.post(API_BASE, asset);
};

export const getDashboardSummary = () => {
    return api.get(`${API_BASE}/dashboard/summary`);
};
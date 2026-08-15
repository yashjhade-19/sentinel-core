import axios from "axios";

const API_BASE = "http://localhost:8080/api/assets";

export const getAllAssets = () => {
    return axios.get(API_BASE);
};

export const getAssetById = (id) => {
    return axios.get(`${API_BASE}/${id}`);
};

export const createAsset = (asset) => {
    return axios.post(API_BASE, asset);
};

export const getDashboardSummary = () => {
    return axios.get(`${API_BASE}/dashboard/summary`);
};
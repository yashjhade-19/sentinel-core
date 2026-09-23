import axios from "axios";

const AUTH_BASE = `${import.meta.env.VITE_API_BASE_URL}/auth`;

export const login = (username, password) =>
    axios.post(`${AUTH_BASE}/login`, { username, password });

export const refreshAccessToken = (refreshToken) =>
    axios.post(`${AUTH_BASE}/refresh`, { refreshToken });
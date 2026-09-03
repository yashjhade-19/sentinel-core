import axios from "axios";
import { refreshAccessToken } from "./authApi";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: { "Content-Type": "application/json" }
});

let currentAccessToken = localStorage.getItem("accessToken");
let currentRefreshToken = localStorage.getItem("refreshToken");
let refreshPromise = null;

export const setTokens = (access, refresh) => {
    currentAccessToken = access || null;
    currentRefreshToken = refresh || null;

    if (access) localStorage.setItem("accessToken", access);
    else localStorage.removeItem("accessToken");

    if (refresh) localStorage.setItem("refreshToken", refresh);
    else localStorage.removeItem("refreshToken");
};

api.interceptors.request.use((config) => {
    if (currentAccessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${currentAccessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest || error.response?.status !== 401) {
            return Promise.reject(error);
        }

        const requestUrl = originalRequest.url || "";
        const isAuthRequest = requestUrl.includes("/auth/");

        if (isAuthRequest || originalRequest._retry || !currentRefreshToken) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = refreshAccessToken(currentRefreshToken)
                    .then((response) => {
                        const newAccessToken = response.data.accessToken;

                        if (!newAccessToken) {
                            throw new Error("Refresh response did not contain an access token");
                        }

                        currentAccessToken = newAccessToken;
                        localStorage.setItem("accessToken", newAccessToken);

                        return newAccessToken;
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            const newAccessToken = await refreshPromise;
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return api(originalRequest);
        } catch (refreshError) {
            setTokens(null, null);
            window.dispatchEvent(new Event("auth:logout"));
            return Promise.reject(refreshError);
        }
    }
);

export default api;

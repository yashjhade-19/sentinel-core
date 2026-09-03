import axios from "axios";
import { refreshAccessToken } from "./authApi";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

let currentAccessToken =
    localStorage.getItem("accessToken");

let currentRefreshToken =
    localStorage.getItem("refreshToken");

export const setTokens = (access, refresh) => {

    currentAccessToken = access;
    currentRefreshToken = refresh;

    if (access) {
        localStorage.setItem("accessToken", access);
    }

    if (refresh) {
        localStorage.setItem("refreshToken", refresh);
    }

    if (!access) {
        localStorage.removeItem("accessToken");
    }

    if (!refresh) {
        localStorage.removeItem("refreshToken");
    }
};

api.interceptors.request.use(
    (config) => {

        if (currentAccessToken) {
            config.headers.Authorization =
                `Bearer ${currentAccessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            currentRefreshToken
        ) {

            originalRequest._retry = true;

            try {

                const response =
                    await refreshAccessToken(
                        currentRefreshToken
                    );

                const newAccessToken =
                    response.data.accessToken;

                currentAccessToken = newAccessToken;

                localStorage.setItem(
                    "accessToken",
                    newAccessToken
                );

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);

            } catch (refreshError) {

                currentAccessToken = null;
                currentRefreshToken = null;

                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                window.location.reload();
            }
        }

        return Promise.reject(error);
    }
);

export default api;
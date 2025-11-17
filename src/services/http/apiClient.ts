import type {
    AxiosInstance,
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import {useAccountStore} from "@/app/stores/userStore.ts";
const apiClient: AxiosInstance = axios.create({
    baseURL: "/api",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = useAccountStore.getState().account?.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
})

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshResponse = await axios.post("/api/sessions/refresh", {}, { withCredentials: true });
                const newAccessToken = refreshResponse.data;

                useAccountStore.getState().setAccount({ token: newAccessToken });

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                useAccountStore.getState().setAccount(null);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
)

export default apiClient;
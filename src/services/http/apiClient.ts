import type {
    AxiosInstance,
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import {useAccountStore} from "@/app/stores/userStore.ts";

const apiClient: AxiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    timeout: 30000,
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

        const noRefreshPaths = [
            '/sessions',
            '/register',
            '/sessions/verify',
            '/sessions/verify/resend',
        ];

        const isNoRefreshPath = noRefreshPaths.some(path =>
            originalRequest.url?.includes(path)
        );

        // Only auto-refresh for protected endpoints, not login/register
        if (error.response?.status === 401 && !originalRequest._retry && !isNoRefreshPath) {
            originalRequest._retry = true;
            try {
                const refreshResponse = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/sessions/refresh`,
                    {},
                    { withCredentials: true }
                );
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
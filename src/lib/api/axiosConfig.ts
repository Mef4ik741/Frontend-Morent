import axios from 'axios';

const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'https://morent-backend-production.up.railway.app/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token =
        localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }
    isRefreshing = true;
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        isRefreshing = false;
        return null;
    }

    const doRefresh = async (): Promise<string | null> => {
        try {
            const res = await axios.post(`${API_BASE_URL}/Auth/refresh`, {
                refreshToken,
            });
            const root: any = res.data || {};
            const data = root.data || root;
            const accessToken =
                data.accessToken ||
                data.token ||
                data.jwtToken ||
                data.access_token;
            const newRefreshToken = data.refreshToken || data.refresh_token;
            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('token', accessToken);
            }
            if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken);
            }
            return accessToken || null;
        } catch (error: any) {
            const status = error?.response?.status;
            // Только если сам refresh говорит, что токен невалидный, полностью разлогиниваем
            if (status === 400 || status === 401 || status === 403) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('token');
            }
            return null;
        } 
    };

    refreshPromise = doRefresh();
    refreshPromise.finally(() => {
        isRefreshing = false;
        refreshPromise = null;
    });
    return refreshPromise;
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            (error.response?.status === 401 || error.response?.status === 403) &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                originalRequest.headers = {
                    ...(originalRequest.headers || {}),
                    Authorization: `Bearer ${newAccessToken}`,
                };
                return api(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

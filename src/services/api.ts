import axios from 'axios';
import { tokenStore } from './tokenStore';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // CRITICAL: send cookies (HttpOnly refresh token) with every request
    withCredentials: true,
});

// ── Request Interceptor ─────────────────────────────────────────────────────
// Attach access token from in-memory store only.
api.interceptors.request.use(
    (config) => {
        const token = tokenStore.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response Interceptor ────────────────────────────────────────────────────
// On 401, silently call /auth/refresh.
// The browser automatically sends the HttpOnly refresh-token cookie.
// No token is read from or written to localStorage here.
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // No body needed — refresh token travels as HttpOnly cookie
                const res = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                if (res.data.success) {
                    const { accessToken } = res.data.data;
                    tokenStore.setAccessToken(accessToken);
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch {
                tokenStore.clearAll();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;

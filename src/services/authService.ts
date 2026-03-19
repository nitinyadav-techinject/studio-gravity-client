import axios from 'axios';
import api from './api';
import type { AuthResponse, DTO } from '../types/auth';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const authService = {
    login: async (credentials: any): Promise<DTO<AuthResponse>> => {
        const response = await api.post<DTO<AuthResponse>>('/auth/login', credentials);
        return response.data;
    },

    getProfile: async (): Promise<DTO<any>> => {
        const response = await api.get<DTO<any>>('/auth/profile');
        return response.data;
    },

    /**
     * Silently exchange the HttpOnly refresh-token cookie for a new access token.
     *
     * NO token needs to be sent in the request body — the browser automatically
     * attaches the HttpOnly cookie. This is the key security improvement:
     * JavaScript never reads or passes the refresh token.
     */
    refreshAccessToken: async (): Promise<DTO<{ accessToken: string }>> => {
        const response = await axios.post<DTO<{ accessToken: string }>>(
            `${API_BASE_URL}/auth/refresh`,
            {},                          // empty body — token is in the cookie
            { withCredentials: true }    // browser sends the HttpOnly cookie
        );
        return response.data;
    },

    /**
     * Tell the backend to clear the HttpOnly refresh-token cookie.
     * Without this, the cookie would persist until it expires naturally.
     */
    logout: async (): Promise<void> => {
        try {
            await axios.post(
                `${API_BASE_URL}/auth/logout`,
                {},
                { withCredentials: true }
            );
        } catch {
            // Best-effort — clear local state regardless
        } finally {
            localStorage.removeItem('user');
        }
    },
};

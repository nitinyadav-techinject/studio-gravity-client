import api from './api';
import type { AuthResponse, DTO } from '../types/auth';

export const authService = {
    login: async (credentials: any): Promise<DTO<AuthResponse>> => {
        const response = await api.post<DTO<AuthResponse>>('/auth/login', credentials);
        return response.data;
    },

    getProfile: async (): Promise<DTO<any>> => {
        const response = await api.get<DTO<any>>('/auth/profile');
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }
};

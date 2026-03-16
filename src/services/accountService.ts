import api from './api';
import type { Account, CreateAccountRequest } from '../types/account';
import type { DTO } from '../types/auth';

export const accountService = {
    createAccount: async (data: CreateAccountRequest): Promise<DTO<Account>> => {
        // Note: If this is protected in backend, it might fail during signup if not handled.
        const response = await api.post<DTO<Account>>('/accounts', data);
        return response.data;
    },

    getAccounts: async (): Promise<DTO<Account[]>> => {
        const response = await api.get<DTO<Account[]>>('/accounts');
        return response.data;
    },

    getAccount: async (id: string): Promise<DTO<Account>> => {
        const response = await api.get<DTO<Account>>(`/accounts/${id}`);
        return response.data;
    }
};

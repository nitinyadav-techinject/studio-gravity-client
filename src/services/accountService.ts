import api from './api';
import type { DTO } from '../types/auth';
import type { 
    Account, 
    CreateAccountRequest, 
    UpdateAccountRequest, 
    Contact, 
    MergeAccountsRequest, 
    MergeAccountsResponse, 
    GetMergeStatusResponse 
} from '../types/account';

export const accountService = {
    createAccount: async (data: CreateAccountRequest): Promise<DTO<Account>> => {
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
    },

    updateAccount: async (id: string, data: UpdateAccountRequest): Promise<DTO<Account>> => {
        const response = await api.put<DTO<Account>>(`/accounts/${id}`, data);
        return response.data;
    },

    deleteAccount: async (id: string): Promise<DTO<null>> => {
        const response = await api.delete<DTO<null>>(`/accounts/${id}`);
        return response.data;
    },

    getContactsByAccountId: async (accountId: string): Promise<DTO<Contact[]>> => {
        const response = await api.get<DTO<Contact[]>>(`/contacts/by-account/${accountId}`);
        return response.data;
    },

    updateContact: async (id: string, data: Partial<Contact>): Promise<DTO<Contact>> => {
        const response = await api.put<DTO<Contact>>(`/contacts/${id}`, data);
        return response.data;
    },

    deleteContact: async (id: string): Promise<DTO<null>> => {
        const response = await api.delete<DTO<null>>(`/contacts/${id}`);
        return response.data;
    },

    mergeAccounts: async (data: MergeAccountsRequest): Promise<DTO<MergeAccountsResponse>> => {
        const response = await api.post<DTO<MergeAccountsResponse>>('/accounts/merge', data);
        return response.data;
    },

    getMergeStatus: async (accountId: string): Promise<DTO<GetMergeStatusResponse>> => {
        const response = await api.get<DTO<GetMergeStatusResponse>>(`/accounts/${accountId}/merge-status`);
        return response.data;
    }
};


import api from './api';
import type { Contact, CreateContactRequest, UpdateContactRequest } from '../types/contact';
import type { DTO } from '../types/auth';

export const contactService = {
    createContact: async (data: CreateContactRequest): Promise<DTO<Contact>> => {
        const response = await api.post<DTO<Contact>>('/contacts', data);
        return response.data;
    },

    getAllContacts: async (): Promise<DTO<Contact[]>> => {
        const response = await api.get<DTO<Contact[]>>('/contacts');
        return response.data;
    },

    getContactById: async (id: string): Promise<DTO<Contact>> => {
        const response = await api.get<DTO<Contact>>(`/contacts/${id}`);
        return response.data;
    },

    updateContact: async (id: string, data: UpdateContactRequest): Promise<DTO<Contact>> => {
        const response = await api.patch<DTO<Contact>>(`/contacts/${id}`, data);
        return response.data;
    },

    deleteContact: async (id: string): Promise<DTO<null>> => {
        const response = await api.delete<DTO<null>>(`/contacts/${id}`);
        return response.data;
    }
};

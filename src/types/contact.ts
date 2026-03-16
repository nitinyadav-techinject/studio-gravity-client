export type Gender = 'male' | 'female' | 'other';

export interface Contact {
    id: string;
    accountId: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    mobile: string | null;
    email: string | null;
    secondaryEmail: string | null;
    gender: Gender | null;
    dateOfBirth: string | null;
    mailingStreet: string | null;
    mailingCity: string | null;
    mailingState: string | null;
    mailingZip: string | null;
    mailingCountry: string | null;
    isPrimaryContact: boolean;
    description: string | null;
    emailOptOut: boolean;
    syncWithZb: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateContactRequest {
    accountId: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    mobile?: string;
    secondaryEmail?: string;
    gender?: Gender;
    dateOfBirth?: string;
    mailingStreet?: string;
    mailingCity?: string;
    mailingState?: string;
    mailingZip?: string;
    mailingCountry?: string;
    isPrimaryContact?: boolean;
    description?: string;
}

export interface UpdateContactRequest extends Partial<CreateContactRequest> { }

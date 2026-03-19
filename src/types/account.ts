export interface Account {
    id: string;
    accountName: string;
    phone: string | null;
    email: string | null;
    billingStreet: string | null;
    billingCity: string | null;
    billingState: string | null;
    billingCode: string | null;
    billingCountry: string | null;
    shippingStreet: string | null;
    shippingCity: string | null;
    shippingState: string | null;
    shippingCode: string | null;
    shippingCountry: string | null;
    description: string | null;
    syncWithZb: boolean;
    createdAt: string;
    updatedAt: string;
    Contacts?: Contact[];
}

export interface CreateAccountRequest {
    accountName: string;
    email?: string;
    phone?: string;
    billingStreet?: string;
    billingCity?: string;
    billingState?: string;
    billingCode?: string;
    billingCountry?: string;
    shippingStreet?: string;
    shippingCity?: string;
    shippingState?: string;
    shippingCode?: string;
    shippingCountry?: string;
    description?: string;
}

export interface UpdateAccountRequest extends Partial<CreateAccountRequest> {}

export interface Contact {
    id: string;
    accountId: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    mobile: string | null;
    email: string | null;
    secondaryEmail: string | null;
    gender: string | null;
    dateOfBirth: string | null;
    mailingStreet: string | null;
    mailingCity: string | null;
    mailingState: string | null;
    mailingZip: string | null;
    mailingCountry: string | null;
    role: 'admin' | 'customer' | null;
    isPrimaryContact: boolean;
    description: string | null;
    emailOptOut: boolean;
    syncWithZb: boolean;
    zohoMetaData: any | null;
    createdAt: string;
    updatedAt: string;
}

export interface MergeAccountsRequest {
    masterAccountId: string;
    duplicateAccountIds: string[];
    fieldOverrides?: Record<string, any>;
}

export interface MergeAccountsResponse {
    masterAccountId: string;
    mergedAccounts: string[];
    status: string;
    message: string;
    jobId?: string;
}

export interface GetMergeStatusResponse {
    jobId: string;
    status: string;
}

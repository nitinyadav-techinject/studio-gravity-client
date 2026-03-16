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

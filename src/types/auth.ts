export interface DTO<T = any> {
    success: boolean;
    message: string;
    code: string;
    data: T | null;
    error: any | null;
}

export const DTO_CODE = {
    SUCCESS: "SUCCESS",
    VALIDATION_ERROR: "VALIDATION_ERROR",
    HANDLED_ERROR: "HANDLED_ERROR",
    UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
};

export interface User {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    mobile: string | null;
    secondaryEmail: string | null;
    gender: import('./contact').Gender | null;
    dateOfBirth: string | null;
    accountId: string;
    role: 'admin' | 'customer' | null;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken?: string; // Set as optional since it now moves to HttpOnly cookie
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt?: string;
    expiresIn: string;
    contact: User;
}

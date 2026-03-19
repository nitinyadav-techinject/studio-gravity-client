import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types/auth';
import { authService } from '../services/authService';
import { tokenStore } from '../services/tokenStore';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (accessToken: string, user: User) => void;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        /**
         * On app load, try to silently restore the session.
         *
         * The refresh token lives only in an HttpOnly cookie — the browser
         * sends it automatically. We just need the user object from localStorage
         * (non-sensitive) and a fresh access token from /auth/refresh.
         */
        const bootstrap = async () => {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                setIsLoading(false);
                return;
            }

            try {
                // Browser automatically sends the HttpOnly refresh-token cookie
                const res = await authService.refreshAccessToken();
                if (res.success && res.data?.accessToken) {
                    tokenStore.setAccessToken(res.data.accessToken);
                    setUser(JSON.parse(storedUser));
                } else {
                    // Cookie expired or missing → clean up
                    tokenStore.clearAll();
                }
            } catch {
                tokenStore.clearAll();
            } finally {
                setIsLoading(false);
            }
        };

        bootstrap();
    }, []);

    /**
     * Called after a successful login API response.
     * The refresh token was already set as HttpOnly cookie by the backend.
     * We only store the access token in memory and the user object in localStorage.
     */
    const login = (accessToken: string, userData: User) => {
        tokenStore.setAccessToken(accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = async () => {
        try {
            // Ask the backend to clear the HttpOnly refresh-token cookie
            await authService.logout();
        } finally {
            tokenStore.clearAll();
            setUser(null);
        }
    };

    const updateUser = (nextUser: User) => {
        setUser(nextUser);
        localStorage.setItem('user', JSON.stringify(nextUser));
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout,
            updateUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

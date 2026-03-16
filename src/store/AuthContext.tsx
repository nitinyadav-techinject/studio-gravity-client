import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (accessToken: string, refreshToken: string, user: User) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('accessToken');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (accessToken: string, refreshToken: string, userData: User) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
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

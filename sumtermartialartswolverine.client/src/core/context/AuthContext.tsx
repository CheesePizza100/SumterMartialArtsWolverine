import type { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosConfig';

export interface User {
    userId: string;
    username: string;
    role: 'Admin' | 'Student' | 'Instructor';
    mustChangePassword: boolean;
}

interface LoginResponse {
    token: string;
    username: string;
    userId: string;
    role: string;
    mustChangePassword: boolean;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isStudent: boolean;
    isInstructor: boolean;
    needsPasswordChange: boolean;
    login: (username: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
    forceLogout: () => void;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    isTokenExpired: () => boolean;
    getToken: () => string | null;
    getCurrentUser: () => User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'current_user';

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem(USER_KEY);
        const token = localStorage.getItem(TOKEN_KEY);

        if (token && storedUser && !isTokenExpired()) {
            setUser(JSON.parse(storedUser));
        } else {
            // Clear invalid session
            clearAuthData();
        }
    }, []);

    const isTokenExpired = (): boolean => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000; // Convert to milliseconds
            return Date.now() > expiry;
        } catch {
            return true;
        }
    };

    const getToken = (): string | null => {
        return localStorage.getItem(TOKEN_KEY);
    };

    const login = async (username: string, password: string): Promise<User> => {
        try {
            const response = await axiosInstance.post<LoginResponse>(
                '/auth/login',
                { username, password }
            );

            const { token, userId, username: userName, role, mustChangePassword } = response.data;

            // Store token
            localStorage.setItem(TOKEN_KEY, token);

            // Store user info
            const userData: User = {
                userId,
                username: userName,
                role: role as 'Admin' | 'Student' | 'Instructor',
                mustChangePassword
            };
            localStorage.setItem(USER_KEY, JSON.stringify(userData));

            // Update state
            setUser(userData);

            return userData;
        } catch (error) {
            throw error;
        }
    };

    const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
        try {
            await axiosInstance.post('/auth/change-password', {
                currentPassword,
                newPassword
            });

            // Update the user object to clear the mustChangePassword flag
            if (user) {
                const updatedUser = { ...user, mustChangePassword: false };
                localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
                setUser(updatedUser);
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await axiosInstance.post('/auth/logout', {});
        } catch (error) {
            // Continue with logout even if API call fails
            console.error('Logout API call failed:', error);
        } finally {
            clearAuthData();
        }
    };

    const forceLogout = (): void => {
        clearAuthData();
    };

    const clearAuthData = (): void => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
        navigate('/login');
    };

    const getCurrentUser = (): User | null => {
        return user;
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user && !isTokenExpired(),
        isAdmin: user?.role === 'Admin',
        isStudent: user?.role === 'Student',
        isInstructor: user?.role === 'Instructor',
        needsPasswordChange: user?.mustChangePassword || false,
        login,
        logout,
        forceLogout,
        changePassword,
        isTokenExpired,
        getToken,
        getCurrentUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
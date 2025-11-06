/**
 * AuthProvider Component
 * ---------------------------------------------------------------------------
 * Provides authentication context and manages JWT token lifecycle.
 * Handles token validation, automatic logout, and user session management.
 */

import React, { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAppStore } from '@/store';
import type { User } from '@/store/types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { user, token, isLoading, setUser, setToken, logout, fetchActiveTimer } = useAppStore();

    const isAuthenticated = !!(user && token);

    useEffect(() => {
        // Check for existing token on app initialization
        const storedToken = localStorage.getItem('timer-app-token');

        if (storedToken && !token) {
            // Validate token and get user info
            validateToken(storedToken);
        }
    }, [token]);

    useEffect(() => {
        // Set up automatic token expiration check
        if (token) {
            const tokenPayload = parseJwtPayload(token);
            if (tokenPayload?.exp) {
                const expirationTime = tokenPayload.exp * 1000; // Convert to milliseconds
                const currentTime = Date.now();
                const timeUntilExpiration = expirationTime - currentTime;

                if (timeUntilExpiration <= 0) {
                    // Token is already expired
                    handleTokenExpiration();
                } else {
                    // Set timeout to logout when token expires
                    const timeoutId = setTimeout(() => {
                        handleTokenExpiration();
                    }, timeUntilExpiration);

                    return () => clearTimeout(timeoutId);
                }
            }
        }
    }, [token]);

    const parseJwtPayload = (token: string) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error parsing JWT payload:', error);
            return null;
        }
    };

    const validateToken = async (tokenToValidate: string) => {
        try {
            // Extract user info from token payload
            const payload = parseJwtPayload(tokenToValidate);

            if (payload && payload.exp && payload.exp * 1000 > Date.now()) {
                // Token is valid and not expired
                setToken(tokenToValidate);

                // Set user from token payload
                if (payload.user) {
                    setUser({
                        id: payload.user.id,
                        name: payload.user.name,
                        email: payload.user.email,
                        createdAt: new Date(payload.user.createdAt),
                    });

                    // Fetch active timer after user is set
                    fetchActiveTimer();
                }
            } else {
                // Token is invalid or expired
                handleTokenExpiration();
            }
        } catch (error) {
            console.error('Token validation failed:', error);
            handleTokenExpiration();
        }
    };

    const handleTokenExpiration = () => {
        console.log('Token expired, logging out user');
        logout();
    };

    const contextValue: AuthContextType = {
        user,
        token,
        isAuthenticated,
        isLoading,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;
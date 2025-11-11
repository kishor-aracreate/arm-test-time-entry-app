/**
 * User Utilities
 * ---------------------------------------------------------------------------
 * Helper functions for managing user identification in localStorage
 */

import { setAccessToken, getAccessToken } from './token';

const USER_ID_KEY = 'user-id';

/**
 * Generate a UUID v4
 */
const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

/**
 * Get the current user ID from localStorage
 * Creates a new UUID if it doesn't exist
 */
export const getUserId = (): string => {
    let userId = localStorage.getItem(USER_ID_KEY);

    if (!userId) {
        // Generate a unique UUID for this user
        userId = generateUUID();
        localStorage.setItem(USER_ID_KEY, userId);
    }

    return userId;
};

/**
 * Clear the current user ID (useful for testing or logout)
 */
export const clearUserId = (): void => {
    localStorage.removeItem(USER_ID_KEY);
};

/**
 * Set a specific user ID (useful for testing)
 */
export const setUserId = (userId: string): void => {
    localStorage.setItem(USER_ID_KEY, userId);
};

/**
 * Generate a JWT token by calling the backend auth endpoint
 * @param userId - Optional user ID to use in the token. If not provided, uses getUserId()
 * @returns Promise that resolves to the generated JWT token
 */
export const generateToken = async (userId?: string): Promise<string> => {
    const id = userId || getUserId();

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    try {
        const response = await fetch(`${API_BASE_URL}/auth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for refresh token
            body: JSON.stringify({ userId: id }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error?.message || 'Failed to generate token');
        }

        const accessToken = data.data.accessToken;

        // Store the generated access token
        setAccessToken(accessToken);

        return accessToken;
    } catch (error) {
        console.error('Error generating token:', error);
        throw error;
    }
};

/**
 * Ensure user has a valid access token
 * If no token exists, redirects to login page
 * @returns true if token exists, false if redirected to login
 */
export const ensureAuthenticated = (): boolean => {
    const token = getAccessToken();

    if (!token) {
        // No token exists - redirect to login page
        window.location.hash = '#/login';
        return false;
    }

    return true;
};

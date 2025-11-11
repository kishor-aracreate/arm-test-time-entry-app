/**
 * Token Storage Utilities
 * ---------------------------------------------------------------------------
 * Helper functions for managing JWT access tokens in localStorage
 */

const ACCESS_TOKEN_KEY = 'accessToken';

/**
 * Get the current access token from localStorage
 * @returns The access token or null if not found
 */
export const getAccessToken = (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Store an access token in localStorage
 * @param token - The JWT access token to store
 */
export const setAccessToken = (token: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

/**
 * Clear the access token from localStorage
 */
export const clearAccessToken = (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
};

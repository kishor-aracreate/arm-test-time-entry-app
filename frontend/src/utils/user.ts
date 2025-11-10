/**
 * User Utilities
 * ---------------------------------------------------------------------------
 * Helper functions for managing user identification in localStorage
 */

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

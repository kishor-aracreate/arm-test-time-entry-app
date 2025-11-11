/**
 * Manual Token Setter
 * ---------------------------------------------------------------------------
 * Utility to manually set a JWT token in localStorage
 * Useful for testing with external tokens
 */

import { setAccessToken } from './token';

/**
 * Manually set a JWT token
 * Usage: Open browser console and run:
 * window.setToken('your-jwt-token-here')
 */
export const manuallySetToken = (token: string): void => {
    setAccessToken(token);
    console.log('✅ Token set successfully!');
    console.log('Reload the page to use the new token.');
};

// Expose to window for easy console access
if (typeof window !== 'undefined') {
    (window as any).setToken = manuallySetToken;
}

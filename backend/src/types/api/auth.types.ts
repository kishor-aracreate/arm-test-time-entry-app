/**
 * Authentication API Types
 * ---------------------------------------------------------------------------
 * Type definitions for authentication-related API operations.
 */

export interface JwtPayload {
    userId: string; // UUID
    iat?: number;   // Issued at (added by jsonwebtoken)
    exp?: number;   // Expiration (added by jsonwebtoken)
}

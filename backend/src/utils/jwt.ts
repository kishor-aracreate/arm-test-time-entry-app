import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

/**
 * JWT token utilities
 */
export class JWTUtils {
    private static readonly SECRET = process.env.JWT_SECRET || 'your-secret-key';
    private static readonly EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

    /**
     * Generate a JWT token for a user
     */
    static generateToken(payload: JWTPayload): string {
        try {
            const secret = this.SECRET;
            if (!secret) {
                throw new Error('JWT secret is not configured');
            }

            return jwt.sign(
                payload as any,
                secret as any,
                {
                    expiresIn: this.EXPIRES_IN,
                    issuer: 'timer-app',
                    audience: 'timer-app-users'
                } as any
            );
        } catch (error) {
            throw new Error('Failed to generate JWT token');
        }
    }

    /**
     * Verify and decode a JWT token
     */
    static verifyToken(token: string): JWTPayload {
        try {
            const secret = this.SECRET;
            if (!secret) {
                throw new Error('JWT secret is not configured');
            }

            const decoded = jwt.verify(token, secret as any, {
                issuer: 'timer-app',
                audience: 'timer-app-users'
            } as any) as unknown as JWTPayload;

            return decoded;
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token has expired');
            } else if (error.name === 'JsonWebTokenError') {
                throw new Error('Invalid token');
            } else if (error.name === 'NotBeforeError') {
                throw new Error('Token not active yet');
            } else {
                throw new Error('Token verification failed');
            }
        }
    }

    /**
     * Decode token without verification (for debugging)
     */
    static decodeToken(token: string): any {
        try {
            return jwt.decode(token);
        } catch (error) {
            throw new Error('Failed to decode token');
        }
    }

    /**
     * Extract token from Authorization header
     */
    static extractTokenFromHeader(authHeader: string | undefined): string | null {
        if (!authHeader) {
            return null;
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return null;
        }

        return parts[1] || null;
    }

    /**
     * Check if token is expired without throwing
     */
    static isTokenExpired(token: string): boolean {
        try {
            this.verifyToken(token);
            return false;
        } catch (error: any) {
            return error.message === 'Token has expired';
        }
    }
}
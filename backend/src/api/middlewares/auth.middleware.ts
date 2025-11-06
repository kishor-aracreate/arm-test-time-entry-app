import { Request, Response, NextFunction } from 'express';
import { JWTUtils } from '../../utils/jwt';
import { UserRepository } from '../repositories/user.repository';
import { ApiResponse, JWTPayload } from '../../types';

// Extend Express Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
            };
        }
    }
}

/**
 * Authentication middleware to verify JWT tokens
 */
export const authMiddleware = async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
): Promise<void> => {
    try {
        // Extract token from Authorization header
        const token = JWTUtils.extractTokenFromHeader(req.headers.authorization);

        if (!token) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Access token is required',
                    code: 'MISSING_TOKEN'
                }
            });
            return;
        }

        // Verify token
        let payload: JWTPayload;
        try {
            payload = JWTUtils.verifyToken(token);
        } catch (error: any) {
            res.status(401).json({
                success: false,
                error: {
                    message: error.message,
                    code: 'INVALID_TOKEN'
                }
            });
            return;
        }

        // Verify user still exists
        const userRepository = new UserRepository();
        const user = await userRepository.findById(payload.userId);

        if (!user) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'User not found',
                    code: 'USER_NOT_FOUND'
                }
            });
            return;
        }

        // Add user info to request
        req.user = {
            id: user.id,
            email: user.email
        };

        next();
    } catch (error: any) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Authentication failed',
                code: 'AUTH_ERROR',
                details: error.message
            }
        });
    }
};

/**
 * Optional authentication middleware - doesn't fail if no token provided
 */
export const optionalAuthMiddleware = async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
): Promise<void> => {
    try {
        const token = JWTUtils.extractTokenFromHeader(req.headers.authorization);

        if (!token) {
            // No token provided, continue without user
            next();
            return;
        }

        // Try to verify token
        try {
            const payload = JWTUtils.verifyToken(token);

            // Verify user still exists
            const userRepository = new UserRepository();
            const user = await userRepository.findById(payload.userId);

            if (user) {
                req.user = {
                    id: user.id,
                    email: user.email
                };
            }
        } catch (error) {
            // Invalid token, but don't fail - just continue without user
            console.warn('Optional auth failed:', error);
        }

        next();
    } catch (error: any) {
        console.error('Optional auth middleware error:', error);
        // Don't fail on errors in optional auth
        next();
    }
};

/**
 * Middleware to check if user is authenticated (for use after authMiddleware)
 */
export const requireAuth = (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
): void => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            error: {
                message: 'Authentication required',
                code: 'AUTH_REQUIRED'
            }
        });
        return;
    }

    next();
};
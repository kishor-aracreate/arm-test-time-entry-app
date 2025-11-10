import { Request, Response, NextFunction } from 'express';

// Extend Express Request interface to include user property
declare global {
    namespace Express {
        interface Request {
            user: {
                id: string; // UUID
            };
        }
    }
}

/**
 * Middleware to extract user ID (UUID) from request headers
 * Uses X-User-ID header
 */
export const userIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // Extract user ID from X-User-ID header
        const userId = req.headers['x-user-id'] as string;

        // Validate that userId exists and is a valid UUID format
        if (!userId) {
            res.status(400).json({
                success: false,
                error: {
                    message: 'User ID is required',
                    code: 'MISSING_USER_ID'
                }
            });
            return;
        }

        // Basic UUID format validation (8-4-4-4-12 hex characters)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(userId)) {
            res.status(400).json({
                success: false,
                error: {
                    message: 'Invalid user ID format (expected UUID)',
                    code: 'INVALID_USER_ID'
                }
            });
            return;
        }

        // Attach user object to request
        req.user = { id: userId };

        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            error: {
                message: 'Failed to process user ID',
                code: 'USER_ID_PROCESSING_ERROR'
            }
        });
    }
};
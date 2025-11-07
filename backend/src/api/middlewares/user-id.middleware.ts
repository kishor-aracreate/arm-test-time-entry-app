import { Request, Response, NextFunction } from 'express';

// Extend Express Request interface to include user property
declare global {
    namespace Express {
        interface Request {
            user: {
                id: number;
            };
        }
    }
}

/**
 * Middleware to extract user ID from request headers
 * Uses X-User-ID header or defaults to static user ID 1
 */
export const userIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // Extract user ID from X-User-ID header, default to '1'
        const userIdHeader = req.headers['x-user-id'] || '1';
        const userId = parseInt(userIdHeader as string, 10);

        // Validate that userId is a valid number
        if (isNaN(userId) || userId <= 0) {
            res.status(400).json({
                success: false,
                error: {
                    message: 'Invalid user ID format',
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
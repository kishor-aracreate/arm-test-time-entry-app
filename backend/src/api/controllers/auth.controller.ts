import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../../config';

/**
 * Auth Controller
 * ---------------------------------------------------------------------------
 * Handles authentication operations like token generation
 */
export class AuthController {
    /**
     * Generate JWT access and refresh tokens for a user ID
     * POST /api/auth/token
     */
    async generateToken(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body;

            // Validate user ID exists
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

            // Validate UUID format
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

            // Generate JWT access token (short-lived)
            const accessToken = jwt.sign(
                { userId },
                config.jwt.secret as string,
                { expiresIn: '24h' }
            );

            // Generate refresh token (long-lived)
            const refreshToken = jwt.sign(
                { userId, type: 'refresh' },
                config.jwt.secret as string,
                { expiresIn: '7d' }
            );

            // Set refresh token in HTTP-only cookie
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: config.nodeEnv === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(200).json({
                success: true,
                data: {
                    accessToken,
                    userId,
                    expiresIn: '24h'
                }
            });
        } catch (error) {
            console.error('Error generating token:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to generate token',
                    code: 'TOKEN_GENERATION_ERROR'
                }
            });
        }
    }

    /**
     * Refresh access token using refresh token
     * POST /api/auth/refresh
     */
    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            // Get refresh token from cookie or request body
            const refreshToken = req.cookies?.refresh_token || req.body?.refreshToken;

            if (!refreshToken) {
                res.status(401).json({
                    success: false,
                    error: {
                        message: 'Refresh token is required',
                        code: 'MISSING_REFRESH_TOKEN'
                    }
                });
                return;
            }

            // Verify refresh token
            let decoded: any;
            try {
                decoded = jwt.verify(refreshToken, config.jwt.secret as string) as any;
            } catch (error: any) {
                res.status(401).json({
                    success: false,
                    error: {
                        message: 'Invalid or expired refresh token',
                        code: 'INVALID_REFRESH_TOKEN'
                    }
                });
                return;
            }

            // Validate it's a refresh token
            if (decoded.type !== 'refresh') {
                res.status(401).json({
                    success: false,
                    error: {
                        message: 'Invalid token type',
                        code: 'INVALID_TOKEN_TYPE'
                    }
                });
                return;
            }

            const userId = decoded.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: {
                        message: 'Invalid refresh token payload',
                        code: 'INVALID_REFRESH_TOKEN'
                    }
                });
                return;
            }

            // Generate new access token
            const accessToken = jwt.sign(
                { userId },
                config.jwt.secret as string,
                { expiresIn: '24h' }
            );

            res.status(200).json({
                success: true,
                data: {
                    accessToken
                }
            });
        } catch (error) {
            console.error('Error refreshing token:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to refresh token',
                    code: 'TOKEN_REFRESH_ERROR'
                }
            });
        }
    }
}

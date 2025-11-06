import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { CreateUserData, LoginCredentials, ApiResponse, AuthResponse } from '../../types';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    /**
     * POST /api/auth/signup
     * Register a new user
     */
    signup = async (req: Request, res: Response<ApiResponse<AuthResponse>>): Promise<void> => {
        try {
            const userData: CreateUserData = req.body;

            // Mock mode for development when database is not available
            if (process.env.NODE_ENV === 'development') {
                try {
                    const result = await this.authService.signup(userData);
                    res.status(201).json({
                        success: true,
                        data: result
                    });
                    return;
                } catch (dbError: any) {
                    // If database error, return mock response
                    if (dbError.message.includes('connect') || dbError.code === 'ECONNREFUSED' || dbError.code === '28P01') {
                        console.warn('⚠️  Database unavailable, returning mock signup response');
                        res.status(201).json({
                            success: true,
                            data: {
                                user: {
                                    id: 1,
                                    name: userData.name,
                                    email: userData.email,
                                    createdAt: new Date()
                                },
                                token: 'mock-jwt-token-for-development'
                            }
                        });
                        return;
                    }
                    throw dbError;
                }
            }

            const result = await this.authService.signup(userData);

            res.status(201).json({
                success: true,
                data: result
            });
        } catch (error: any) {
            console.error('Signup error:', error);

            // Handle specific error types
            if (error.message.includes('already exists')) {
                res.status(409).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 'USER_EXISTS'
                    }
                });
                return;
            }

            if (error.message.includes('Validation failed') || error.message.includes('Password validation failed')) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 'VALIDATION_ERROR'
                    }
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to create user account',
                    code: 'SIGNUP_ERROR',
                    details: error.message
                }
            });
        }
    };

    /**
     * POST /api/auth/login
     * Authenticate user login
     */
    login = async (req: Request, res: Response<ApiResponse<AuthResponse>>): Promise<void> => {
        try {
            const credentials: LoginCredentials = req.body;

            // Mock mode for development when database is not available
            if (process.env.NODE_ENV === 'development') {
                try {
                    const result = await this.authService.login(credentials);
                    res.status(200).json({
                        success: true,
                        data: result
                    });
                    return;
                } catch (dbError: any) {
                    // If database error, return mock response
                    if (dbError.message.includes('connect') || dbError.code === 'ECONNREFUSED' || dbError.code === '28P01') {
                        console.warn('⚠️  Database unavailable, returning mock login response');
                        res.status(200).json({
                            success: true,
                            data: {
                                user: {
                                    id: 1,
                                    name: 'Test User',
                                    email: credentials.email,
                                    createdAt: new Date()
                                },
                                token: 'mock-jwt-token-for-development'
                            }
                        });
                        return;
                    }
                    throw dbError;
                }
            }

            const result = await this.authService.login(credentials);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error: any) {
            console.error('Login error:', error);

            if (error.message.includes('Invalid email or password') || error.message.includes('required')) {
                res.status(401).json({
                    success: false,
                    error: {
                        message: 'Invalid email or password',
                        code: 'INVALID_CREDENTIALS'
                    }
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: {
                    message: 'Login failed',
                    code: 'LOGIN_ERROR',
                    details: error.message
                }
            });
        }
    };

    /**
     * POST /api/auth/logout
     * Logout user (client-side token removal)
     */
    logout = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
        try {
            // Since we're using stateless JWT tokens, logout is primarily handled client-side
            // by removing the token from storage. We just return a success response.
            // In a more complex system, you might maintain a blacklist of tokens.

            res.status(200).json({
                success: true,
                data: {
                    message: 'Logged out successfully'
                }
            });
        } catch (error: any) {
            console.error('Logout error:', error);

            res.status(500).json({
                success: false,
                error: {
                    message: 'Logout failed',
                    code: 'LOGOUT_ERROR',
                    details: error.message
                }
            });
        }
    };

    /**
     * GET /api/auth/profile
     * Get current user profile (requires authentication)
     */
    getProfile = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
        try {
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

            const user = await this.authService.getProfile(req.user.id);

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error: any) {
            console.error('Get profile error:', error);

            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'User not found',
                        code: 'USER_NOT_FOUND'
                    }
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to get user profile',
                    code: 'PROFILE_ERROR',
                    details: error.message
                }
            });
        }
    };

    /**
     * PUT /api/auth/profile
     * Update current user profile (requires authentication)
     */
    updateProfile = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
        try {
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

            const updates = req.body;
            const user = await this.authService.updateProfile(req.user.id, updates);

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error: any) {
            console.error('Update profile error:', error);

            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'User not found',
                        code: 'USER_NOT_FOUND'
                    }
                });
                return;
            }

            if (error.message.includes('already exists') || error.message.includes('validation')) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 'VALIDATION_ERROR'
                    }
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to update profile',
                    code: 'UPDATE_ERROR',
                    details: error.message
                }
            });
        }
    };

    /**
     * POST /api/auth/change-password
     * Change user password (requires authentication)
     */
    changePassword = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
        try {
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

            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Current password and new password are required',
                        code: 'MISSING_PASSWORDS'
                    }
                });
                return;
            }

            await this.authService.changePassword(req.user.id, currentPassword, newPassword);

            res.status(200).json({
                success: true,
                data: {
                    message: 'Password changed successfully'
                }
            });
        } catch (error: any) {
            console.error('Change password error:', error);

            if (error.message.includes('incorrect') || error.message.includes('not found')) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 'INVALID_PASSWORD'
                    }
                });
                return;
            }

            if (error.message.includes('validation')) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 'VALIDATION_ERROR'
                    }
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to change password',
                    code: 'PASSWORD_CHANGE_ERROR',
                    details: error.message
                }
            });
        }
    };
}
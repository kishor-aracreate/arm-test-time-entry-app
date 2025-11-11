/**
 * API Response Types
 * ---------------------------------------------------------------------------
 * Type definitions for standardized API responses.
 */

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code: string;
        details?: any;
    };
}

export interface ApiError {
    message: string;
    code: string;
    details?: any;
}

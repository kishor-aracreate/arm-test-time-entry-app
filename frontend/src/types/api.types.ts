/**
 * API Types
 * ---------------------------------------------------------------------------
 * TypeScript interfaces for API requests and responses.
 */

export interface ApiErrorDetails {
    message: string;
    code: string;
    details?: unknown;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: ApiErrorDetails;
}

export interface RefreshTokenResponse {
    accessToken: string;
}

export interface DailySummary {
    totalHours: number;
    totalEntries: number;
    projects: Array<{
        projectId: number;
        projectName: string;
        totalHours: number;
    }>;
}

export interface WeeklySummary {
    totalHours: number;
    days: Array<{
        date: string;
        totalHours: number;
        entries: number;
    }>;
}

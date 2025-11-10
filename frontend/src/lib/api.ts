/**
 * API Service
 * ---------------------------------------------------------------------------
 * HTTP client for communicating with the backend API.
 * Handles error handling, request/response formatting, and user ID headers.
 */

import type {
    Project,
    CreateProjectData,
    ActiveTimer,
    StartTimerData,
    TimeEntry,
    CreateTimeEntryData,
    UpdateTimeEntryData
} from '@/store/types';
import { getUserId } from '@/utils/user';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code: string;
        details?: any;
    };
}

class ApiError extends Error {
    public code: string;
    public details?: any;

    constructor(
        message: string,
        code: string,
        details?: any
    ) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.details = details;
    }
}

class ApiService {
    private getHeaders(): HeadersInit {
        return {
            'Content-Type': 'application/json',
            'X-User-ID': getUserId(),
        };
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const config: RequestInit = {
            headers: this.getHeaders(),
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data: ApiResponse<T> = await response.json();

            if (!response.ok || !data.success) {
                throw new ApiError(
                    data.error?.message || 'Request failed',
                    data.error?.code || 'UNKNOWN_ERROR',
                    data.error?.details
                );
            }

            return data.data as T;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            // Network or parsing errors
            throw new ApiError(
                'Network error occurred',
                'NETWORK_ERROR',
                error
            );
        }
    }



    // Project endpoints
    async getProjects(): Promise<Project[]> {
        return this.request('/projects');
    }

    async createProject(data: CreateProjectData): Promise<Project> {
        return this.request('/projects', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateProject(id: number, data: Partial<CreateProjectData>): Promise<Project> {
        return this.request(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteProject(id: number): Promise<void> {
        return this.request(`/projects/${id}`, {
            method: 'DELETE',
        });
    }

    // Timer endpoints
    async startTimer(data: StartTimerData): Promise<ActiveTimer> {
        return this.request('/timer/start', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async stopTimer(): Promise<void> {
        return this.request('/timer/stop', {
            method: 'POST',
        });
    }

    async getActiveTimer(): Promise<ActiveTimer | null> {
        try {
            return await this.request('/timer/active');
        } catch (error) {
            // If no active timer exists, return null instead of throwing
            if (error instanceof ApiError && error.code === 'NO_ACTIVE_TIMER') {
                return null;
            }
            throw error;
        }
    }

    // Time entry endpoints
    async getTimeEntries(date?: string): Promise<TimeEntry[]> {
        const params = new URLSearchParams();
        if (date) {
            params.append('date', date);
        }
        params.append('includeProjects', 'true');

        const queryString = params.toString();
        const endpoint = queryString ? `/time-entries?${queryString}` : '/time-entries';

        return this.request(endpoint);
    }

    async createTimeEntry(data: CreateTimeEntryData): Promise<TimeEntry> {
        return this.request('/time-entries', {
            method: 'POST',
            body: JSON.stringify({
                ...data,
                startTime: data.startTime.toISOString(),
                endTime: data.endTime.toISOString(),
            }),
        });
    }

    async updateTimeEntry(id: number, data: UpdateTimeEntryData): Promise<TimeEntry> {
        const updateData = { ...data };
        if (updateData.startTime) {
            updateData.startTime = updateData.startTime.toISOString() as any;
        }
        if (updateData.endTime) {
            updateData.endTime = updateData.endTime.toISOString() as any;
        }

        return this.request(`/time-entries/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    }

    async deleteTimeEntry(id: number): Promise<void> {
        return this.request(`/time-entries/${id}`, {
            method: 'DELETE',
        });
    }

    async getDailySummary(date: string): Promise<any> {
        return this.request(`/time-entries/summary/daily?date=${date}`);
    }

    async getWeeklySummary(startDate: string, endDate: string): Promise<any> {
        return this.request(`/time-entries/summary/weekly?startDate=${startDate}&endDate=${endDate}`);
    }
}

export const apiService = new ApiService();
export { ApiError };
export type { ApiResponse };
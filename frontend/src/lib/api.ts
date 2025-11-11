/**
 * API Service
 * ---------------------------------------------------------------------------
 * HTTP client for communicating with the backend API.
 * Handles error handling, request/response formatting, and JWT authentication.
 */

import type {
  Project,
  CreateProjectData,
  ActiveTimer,
  StartTimerData,
  TimeEntry,
  CreateTimeEntryData,
  UpdateTimeEntryData,
  ApiResponse,
  RefreshTokenResponse,
  DailySummary,
  WeeklySummary,
} from "@/types";
import { getAccessToken } from "@/utils/token";

const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiError extends Error {
  public code: string;
  public details?: unknown;

  constructor(message: string, code: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
  }
}

class ApiService {
  private getHeaders(): HeadersInit {
    const token = getAccessToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Check if access token exists before making request
    const token = getAccessToken();
    if (!token) {
      throw new ApiError("No access token found", "MISSING_TOKEN");
    }

    const config: RequestInit = {
      headers: this.getHeaders(),
      credentials: "include", // Include cookies for refresh token
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data: ApiResponse<T> = await response.json();

      if (!response.ok || !data.success) {
        const error = new ApiError(
          data.error?.message || "Request failed",
          data.error?.code || "UNKNOWN_ERROR",
          data.error?.details
        );

        // Handle token expiration - backend already refreshed it
        if (error.code === "TOKEN_EXPIRED" && data.data?.accessToken) {
          // Update the access token from backend response
          const newToken = (data.data as any).accessToken;
          localStorage.setItem("accessToken", newToken);

          // Retry the original request with new token
          const retryConfig: RequestInit = {
            ...config,
            headers: this.getHeaders(), // Get updated headers with new token
          };

          const retryResponse = await fetch(url, retryConfig);
          const retryData: ApiResponse<T> = await retryResponse.json();

          if (!retryResponse.ok || !retryData.success) {
            throw new ApiError(
              retryData.error?.message || "Request failed",
              retryData.error?.code || "UNKNOWN_ERROR",
              retryData.error?.details
            );
          }

          return retryData.data as T;
        }

        // Handle other authentication errors - redirect to login
        if (this.isAuthError(error.code)) {
          // Clear the invalid token
          localStorage.removeItem("accessToken");
          window.location.hash = "#/login";
        }

        throw error;
      }

      return data.data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or parsing errors
      throw new ApiError("Network error occurred", "NETWORK_ERROR", error);
    }
  }

  // Project endpoints
  async getProjects(): Promise<Project[]> {
    return this.request("/projects");
  }

  async createProject(data: CreateProjectData): Promise<Project> {
    return this.request("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProject(
    id: number,
    data: Partial<CreateProjectData>
  ): Promise<Project> {
    return this.request(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: number): Promise<void> {
    return this.request(`/projects/${id}`, {
      method: "DELETE",
    });
  }

  // Timer endpoints
  async startTimer(data: StartTimerData): Promise<ActiveTimer> {
    return this.request("/timer/start", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async stopTimer(): Promise<void> {
    return this.request("/timer/stop", {
      method: "POST",
    });
  }

  async getActiveTimer(): Promise<ActiveTimer | null> {
    try {
      return await this.request("/timer/active");
    } catch (error) {
      // If no active timer exists, return null instead of throwing
      if (error instanceof ApiError && error.code === "NO_ACTIVE_TIMER") {
        return null;
      }
      // Re-throw authentication errors for handling by caller
      if (error instanceof ApiError && this.isAuthError(error.code)) {
        throw error;
      }
      throw error;
    }
  }

  /**
   * Check if an error code represents an authentication error
   */
  private isAuthError(code: string): boolean {
    const authErrorCodes = [
      "MISSING_TOKEN",
      "INVALID_TOKEN_FORMAT",
      "TOKEN_EXPIRED",
      "INVALID_TOKEN",
      "INVALID_USER_ID",
    ];
    return authErrorCodes.includes(code);
  }

  // Time entry endpoints
  async getTimeEntries(date?: string): Promise<TimeEntry[]> {
    const params = new URLSearchParams();
    if (date) {
      params.append("date", date);
    }
    params.append("includeProjects", "true");

    const queryString = params.toString();
    const endpoint = queryString
      ? `/time-entries?${queryString}`
      : "/time-entries";

    return this.request(endpoint);
  }

  async createTimeEntry(data: CreateTimeEntryData): Promise<TimeEntry> {
    return this.request("/time-entries", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
      }),
    });
  }

  async updateTimeEntry(
    id: number,
    data: UpdateTimeEntryData
  ): Promise<TimeEntry> {
    const updateData: Record<string, unknown> = { ...data };
    if (updateData.startTime instanceof Date) {
      updateData.startTime = updateData.startTime.toISOString();
    }
    if (updateData.endTime instanceof Date) {
      updateData.endTime = updateData.endTime.toISOString();
    }

    return this.request(`/time-entries/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  async deleteTimeEntry(id: number): Promise<void> {
    return this.request(`/time-entries/${id}`, {
      method: "DELETE",
    });
  }

  async getDailySummary(date: string): Promise<DailySummary> {
    return this.request(`/time-entries/summary/daily?date=${date}`);
  }

  async getWeeklySummary(
    startDate: string,
    endDate: string
  ): Promise<WeeklySummary> {
    return this.request(
      `/time-entries/summary/weekly?startDate=${startDate}&endDate=${endDate}`
    );
  }
}

export const apiService = new ApiService();
export { ApiError };
export type { ApiResponse, DailySummary, WeeklySummary };

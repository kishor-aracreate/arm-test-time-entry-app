// User types
export interface User {
    userId: string; // UUID
    createdAt: Date;
}

export interface CreateUserData {
    userId: string; // UUID
}

// Project types
export interface Project {
    id: number;
    userId: string; // UUID
    name: string;
    color: string;
    createdAt: Date;
}

export interface CreateProjectData {
    name: string;
    color: string;
}

export interface UpdateProjectData {
    name?: string;
    color?: string;
}

// Time Entry types
export interface TimeEntry {
    id: number;
    userId: string; // UUID
    projectId?: number;
    taskName: string;
    startTime: Date;
    endTime: Date;
    duration: number; // in seconds
    createdAt: Date;
    project?: Project;
}

export interface CreateTimeEntryData {
    projectId?: number;
    taskName: string;
    startTime: Date;
    endTime: Date;
}

export interface UpdateTimeEntryData {
    projectId?: number;
    taskName?: string;
    startTime?: Date;
    endTime?: Date;
}

// Active Timer types
export interface ActiveTimer {
    id: number;
    userId: string; // UUID
    projectId?: number;
    taskName: string;
    startTime: Date;
    project?: Project;
}

export interface StartTimerData {
    projectId?: number;
    taskName: string;
}

// Authentication types (not used in current implementation)
export interface JWTPayload {
    userId: string; // UUID
}

// API Response types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code: string;
        details?: any;
    };
}

// Database query result types
export interface DatabaseUser {
    user_id: string; // UUID
    created_at: Date;
}

export interface DatabaseProject {
    id: number;
    user_id: string; // UUID
    name: string;
    color: string;
    created_at: Date;
}

export interface DatabaseTimeEntry {
    id: number;
    user_id: string; // UUID
    project_id?: number;
    task_name: string;
    start_time: Date;
    end_time: Date;
    duration: number;
    created_at: Date;
}

export interface DatabaseActiveTimer {
    id: number;
    user_id: string; // UUID
    project_id?: number;
    task_name: string;
    start_time: Date;
}
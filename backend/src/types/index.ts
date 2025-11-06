// User types
export interface User {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
}

export interface CreateUserData {
    name: string;
    email: string;
    password: string;
}

export interface UserWithPassword extends User {
    passwordHash: string;
}

// Project types
export interface Project {
    id: number;
    userId: number;
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
    userId: number;
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
    userId: number;
    projectId?: number;
    taskName: string;
    startTime: Date;
    project?: Project;
}

export interface StartTimerData {
    projectId?: number;
    taskName: string;
}

// Authentication types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface JWTPayload {
    userId: number;
    email: string;
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
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_at: Date;
}

export interface DatabaseProject {
    id: number;
    user_id: number;
    name: string;
    color: string;
    created_at: Date;
}

export interface DatabaseTimeEntry {
    id: number;
    user_id: number;
    project_id?: number;
    task_name: string;
    start_time: Date;
    end_time: Date;
    duration: number;
    created_at: Date;
}

export interface DatabaseActiveTimer {
    id: number;
    user_id: number;
    project_id?: number;
    task_name: string;
    start_time: Date;
}
/**
 * Store Types
 * ---------------------------------------------------------------------------
 * TypeScript interfaces for the application state management.
 * These types define the shape of data used throughout the app.
 */

export interface User {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
}

export interface Project {
    id: number;
    userId: number;
    name: string;
    color: string;
    createdAt: Date;
}

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

export interface ActiveTimer {
    id: number;
    userId: number;
    projectId?: number;
    taskName: string;
    startTime: Date;
    project?: Project;
}

// API request/response types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupData {
    name: string;
    email: string;
    password: string;
}

export interface StartTimerData {
    taskName: string;
    projectId?: number;
}

export interface CreateProjectData {
    name: string;
    color: string;
}

export interface CreateTimeEntryData {
    taskName: string;
    projectId?: number;
    startTime: Date;
    endTime: Date;
}

export interface UpdateTimeEntryData {
    taskName?: string;
    projectId?: number;
    startTime?: Date;
    endTime?: Date;
}
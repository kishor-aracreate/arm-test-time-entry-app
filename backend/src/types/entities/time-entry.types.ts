/**
 * Time Entry Entity Types
 * ---------------------------------------------------------------------------
 * Type definitions for time entry-related entities and operations.
 */

import type { Project } from './project.types';

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

/**
 * Timer Entity Types
 * ---------------------------------------------------------------------------
 * Type definitions for active timer-related entities and operations.
 */

import type { Project } from './project.types';

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

export interface DatabaseActiveTimer {
    id: number;
    user_id: string; // UUID
    project_id?: number;
    task_name: string;
    start_time: Date;
}

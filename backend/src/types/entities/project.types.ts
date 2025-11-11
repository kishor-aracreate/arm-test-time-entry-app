/**
 * Project Entity Types
 * ---------------------------------------------------------------------------
 * Type definitions for project-related entities and operations.
 */

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

export interface DatabaseProject {
    id: number;
    user_id: string; // UUID
    name: string;
    color: string;
    created_at: Date;
}

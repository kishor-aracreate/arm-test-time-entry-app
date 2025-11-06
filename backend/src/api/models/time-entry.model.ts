import { TimeEntry, CreateTimeEntryData, UpdateTimeEntryData, DatabaseTimeEntry } from '../../types';

export class TimeEntryModel {
    /**
     * Convert database time entry record to TimeEntry interface
     */
    static fromDatabase(dbTimeEntry: DatabaseTimeEntry): TimeEntry {
        const timeEntry: TimeEntry = {
            id: dbTimeEntry.id,
            userId: dbTimeEntry.user_id,
            taskName: dbTimeEntry.task_name,
            startTime: dbTimeEntry.start_time,
            endTime: dbTimeEntry.end_time,
            duration: dbTimeEntry.duration,
            createdAt: dbTimeEntry.created_at
        };

        if (dbTimeEntry.project_id !== null && dbTimeEntry.project_id !== undefined) {
            timeEntry.projectId = dbTimeEntry.project_id;
        }

        return timeEntry;
    }

    /**
     * Calculate duration in seconds between start and end time
     */
    static calculateDuration(startTime: Date, endTime: Date): number {
        return Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    }

    /**
     * Validate time entry data for creation
     */
    static validateCreateData(data: any): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!data.taskName || typeof data.taskName !== 'string' || data.taskName.trim().length === 0) {
            errors.push('Task name is required and must be a non-empty string');
        }

        if (!data.startTime) {
            errors.push('Start time is required');
        } else if (!this.isValidDate(data.startTime)) {
            errors.push('Start time must be a valid date');
        }

        if (!data.endTime) {
            errors.push('End time is required');
        } else if (!this.isValidDate(data.endTime)) {
            errors.push('End time must be a valid date');
        }

        // Validate time range if both dates are valid
        if (data.startTime && data.endTime && this.isValidDate(data.startTime) && this.isValidDate(data.endTime)) {
            const startTime = new Date(data.startTime);
            const endTime = new Date(data.endTime);

            if (endTime <= startTime) {
                errors.push('End time must be after start time');
            }
        }

        if (data.projectId !== undefined && data.projectId !== null) {
            if (!Number.isInteger(data.projectId) || data.projectId <= 0) {
                errors.push('Project ID must be a positive integer');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate time entry data for update
     */
    static validateUpdateData(data: any): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (data.taskName !== undefined) {
            if (typeof data.taskName !== 'string' || data.taskName.trim().length === 0) {
                errors.push('Task name must be a non-empty string');
            }
        }

        if (data.startTime !== undefined) {
            if (!this.isValidDate(data.startTime)) {
                errors.push('Start time must be a valid date');
            }
        }

        if (data.endTime !== undefined) {
            if (!this.isValidDate(data.endTime)) {
                errors.push('End time must be a valid date');
            }
        }

        if (data.projectId !== undefined && data.projectId !== null) {
            if (!Number.isInteger(data.projectId) || data.projectId <= 0) {
                errors.push('Project ID must be a positive integer');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate that updated time range is valid
     */
    static validateTimeRange(startTime: Date, endTime: Date): { isValid: boolean; error?: string } {
        if (endTime <= startTime) {
            return {
                isValid: false,
                error: 'End time must be after start time'
            };
        }

        return { isValid: true };
    }

    /**
     * Check if a value is a valid date
     */
    private static isValidDate(date: any): boolean {
        if (!date) return false;
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
    }
}
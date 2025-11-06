import { ActiveTimer, StartTimerData, DatabaseActiveTimer } from '../../types';

export class ActiveTimerModel {
    /**
     * Convert database active timer record to ActiveTimer interface
     */
    static fromDatabase(dbActiveTimer: DatabaseActiveTimer): ActiveTimer {
        const activeTimer: ActiveTimer = {
            id: dbActiveTimer.id,
            userId: dbActiveTimer.user_id,
            taskName: dbActiveTimer.task_name,
            startTime: dbActiveTimer.start_time
        };

        if (dbActiveTimer.project_id !== null && dbActiveTimer.project_id !== undefined) {
            activeTimer.projectId = dbActiveTimer.project_id;
        }

        return activeTimer;
    }

    /**
     * Calculate elapsed time in seconds from start time to now
     */
    static calculateElapsedTime(startTime: Date): number {
        return Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    }

    /**
     * Validate timer start data
     */
    static validateStartData(data: any): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!data.taskName || typeof data.taskName !== 'string' || data.taskName.trim().length === 0) {
            errors.push('Task name is required and must be a non-empty string');
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
}
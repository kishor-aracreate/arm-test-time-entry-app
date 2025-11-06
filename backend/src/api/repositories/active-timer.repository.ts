import { pool } from '../../config/database';
import { ActiveTimer, StartTimerData, DatabaseActiveTimer, CreateTimeEntryData } from '../../types';
import { ActiveTimerModel } from '../models/active-timer.model';
import { TimeEntryRepository } from './time-entry.repository';

export class ActiveTimerRepository {
    private timeEntryRepository: TimeEntryRepository;

    constructor() {
        this.timeEntryRepository = new TimeEntryRepository();
    }

    /**
     * Start a new active timer for a user
     * Ensures only one active timer per user by replacing any existing timer
     */
    async startTimer(userId: number, timerData: StartTimerData): Promise<ActiveTimer> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // First, stop any existing active timer for this user
            await this.stopExistingTimer(userId, client);

            // Create new active timer
            const query = `
                INSERT INTO active_timers (user_id, project_id, task_name, start_time)
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                RETURNING id, user_id, project_id, task_name, start_time
            `;

            const values = [
                userId,
                timerData.projectId || null,
                timerData.taskName
            ];

            const result = await client.query(query, values);

            if (result.rows.length === 0) {
                throw new Error('Failed to start timer');
            }

            await client.query('COMMIT');
            return ActiveTimerModel.fromDatabase(result.rows[0]!);
        } catch (error: any) {
            await client.query('ROLLBACK');
            if (error.code === '23503') { // Foreign key constraint violation
                throw new Error('Invalid project ID or user ID');
            }
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Stop the active timer for a user and create a time entry
     */
    async stopTimer(userId: number): Promise<{ timeEntry: any; stoppedTimer: ActiveTimer } | null> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Get the active timer
            const activeTimer = await this.findByUserId(userId, client);
            if (!activeTimer) {
                await client.query('ROLLBACK');
                return null;
            }

            // Create time entry from the active timer
            const endTime = new Date();
            const timeEntryData: CreateTimeEntryData = {
                taskName: activeTimer.taskName,
                startTime: activeTimer.startTime,
                endTime: endTime
            };

            if (activeTimer.projectId) {
                timeEntryData.projectId = activeTimer.projectId;
            }

            const timeEntry = await this.timeEntryRepository.create(userId, timeEntryData);

            // Delete the active timer
            await this.deleteByUserId(userId, client);

            await client.query('COMMIT');
            return { timeEntry, stoppedTimer: activeTimer };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Get the active timer for a user
     */
    async findByUserId(userId: number, client?: any): Promise<ActiveTimer | null> {
        const queryClient = client || pool;

        const query = `
            SELECT id, user_id, project_id, task_name, start_time
            FROM active_timers
            WHERE user_id = $1
        `;

        const result = await queryClient.query(query, [userId]);

        if (result.rows.length === 0) {
            return null;
        }

        return ActiveTimerModel.fromDatabase(result.rows[0]!);
    }

    /**
     * Get active timer with project information
     */
    async findByUserIdWithProject(userId: number): Promise<ActiveTimer | null> {
        const query = `
            SELECT 
                at.id, at.user_id, at.project_id, at.task_name, at.start_time,
                p.id as project_id, p.name as project_name, p.color as project_color, p.created_at as project_created_at
            FROM active_timers at
            LEFT JOIN projects p ON at.project_id = p.id
            WHERE at.user_id = $1
        `;

        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return null;
        }

        const row = result.rows[0]!;
        const activeTimer = ActiveTimerModel.fromDatabase({
            id: row.id,
            user_id: row.user_id,
            project_id: row.project_id,
            task_name: row.task_name,
            start_time: row.start_time
        });

        // Add project information if available
        if (row.project_id && row.project_name) {
            activeTimer.project = {
                id: row.project_id,
                userId: userId,
                name: row.project_name,
                color: row.project_color,
                createdAt: row.project_created_at
            };
        }

        return activeTimer;
    }

    /**
     * Check if user has an active timer
     */
    async hasActiveTimer(userId: number): Promise<boolean> {
        const query = `
            SELECT 1 FROM active_timers WHERE user_id = $1 LIMIT 1
        `;

        const result = await pool.query(query, [userId]);
        return result.rows.length > 0;
    }

    /**
     * Delete active timer by user ID (used internally)
     */
    private async deleteByUserId(userId: number, client?: any): Promise<boolean> {
        const queryClient = client || pool;

        const query = `
            DELETE FROM active_timers WHERE user_id = $1
        `;

        const result = await queryClient.query(query, [userId]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    /**
     * Stop existing timer without creating time entry (used internally)
     */
    private async stopExistingTimer(userId: number, client: any): Promise<void> {
        // Just delete any existing active timer - this is used when starting a new timer
        // to ensure single-timer-per-user constraint
        await this.deleteByUserId(userId, client);
    }
}
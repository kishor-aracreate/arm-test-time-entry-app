import { pool } from '../../config/database';
import { TimeEntry, CreateTimeEntryData, UpdateTimeEntryData, DatabaseTimeEntry, Project } from '../../types';
import { TimeEntryModel } from '../models/time-entry.model';

export class TimeEntryRepository {
    /**
     * Create a new time entry
     */
    async create(userId: string, timeEntryData: CreateTimeEntryData): Promise<TimeEntry> {
        const duration = TimeEntryModel.calculateDuration(timeEntryData.startTime, timeEntryData.endTime);

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Ensure user exists (auto-create if not)
            await client.query(
                'INSERT INTO users (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING',
                [userId]
            );

            const query = `
                INSERT INTO time_entries (user_id, project_id, task_name, start_time, end_time, duration)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, user_id, project_id, task_name, start_time, end_time, duration, created_at
            `;

            const values = [
                userId,
                timeEntryData.projectId || null,
                timeEntryData.taskName,
                timeEntryData.startTime,
                timeEntryData.endTime,
                duration
            ];

            const result = await client.query<DatabaseTimeEntry>(query, values);
            if (result.rows.length === 0) {
                throw new Error('Failed to create time entry');
            }

            await client.query('COMMIT');
            return TimeEntryModel.fromDatabase(result.rows[0]!);
        } catch (error: any) {
            await client.query('ROLLBACK');
            if (error.code === '23503') { // Foreign key constraint violation
                throw new Error('Invalid project ID or user ID');
            }
            if (error.code === '23514') { // Check constraint violation
                throw new Error('End time must be after start time');
            }
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Find time entries by user ID with optional date filtering
     */
    async findByUserId(userId: string, date?: string): Promise<TimeEntry[]> {
        let query = `
            SELECT te.id, te.user_id, te.project_id, te.task_name, te.start_time, te.end_time, te.duration, te.created_at
            FROM time_entries te
            WHERE te.user_id = $1
        `;

        const values: any[] = [userId];

        if (date) {
            query += ` AND DATE(te.start_time) = $2`;
            values.push(date);
        }

        query += ` ORDER BY te.start_time DESC`;

        const result = await pool.query<DatabaseTimeEntry>(query, values);
        return result.rows.map(row => TimeEntryModel.fromDatabase(row));
    }

    /**
     * Find time entries with project information
     */
    async findByUserIdWithProjects(userId: string, date?: string): Promise<TimeEntry[]> {
        let query = `
            SELECT 
                te.id, te.user_id, te.project_id, te.task_name, te.start_time, te.end_time, te.duration, te.created_at,
                p.id as project_id, p.name as project_name, p.color as project_color, p.created_at as project_created_at
            FROM time_entries te
            LEFT JOIN projects p ON te.project_id = p.id
            WHERE te.user_id = $1
        `;

        const values: any[] = [userId];

        if (date) {
            query += ` AND DATE(te.start_time) = $2`;
            values.push(date);
        }

        query += ` ORDER BY te.start_time DESC`;

        const result = await pool.query(query, values);

        return result.rows.map(row => {
            const timeEntry = TimeEntryModel.fromDatabase({
                id: row.id,
                user_id: row.user_id,
                project_id: row.project_id,
                task_name: row.task_name,
                start_time: row.start_time,
                end_time: row.end_time,
                duration: row.duration,
                created_at: row.created_at
            });

            // Add project information if available
            if (row.project_id && row.project_name) {
                timeEntry.project = {
                    id: row.project_id,
                    userId: userId,
                    name: row.project_name,
                    color: row.project_color,
                    createdAt: row.project_created_at
                };
            }

            return timeEntry;
        });
    }

    /**
     * Find time entry by ID and user ID
     */
    async findByIdAndUserId(id: number, userId: string): Promise<TimeEntry | null> {
        const query = `
            SELECT id, user_id, project_id, task_name, start_time, end_time, duration, created_at
            FROM time_entries
            WHERE id = $1 AND user_id = $2
        `;

        const result = await pool.query<DatabaseTimeEntry>(query, [id, userId]);

        if (result.rows.length === 0) {
            return null;
        }

        return TimeEntryModel.fromDatabase(result.rows[0]!);
    }

    /**
     * Update time entry
     */
    async update(id: number, userId: string, updates: UpdateTimeEntryData): Promise<TimeEntry | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (updates.taskName !== undefined) {
            fields.push(`task_name = $${paramCount}`);
            values.push(updates.taskName);
            paramCount++;
        }

        if (updates.projectId !== undefined) {
            fields.push(`project_id = $${paramCount}`);
            values.push(updates.projectId);
            paramCount++;
        }

        if (updates.startTime !== undefined) {
            fields.push(`start_time = $${paramCount}`);
            values.push(updates.startTime);
            paramCount++;
        }

        if (updates.endTime !== undefined) {
            fields.push(`end_time = $${paramCount}`);
            values.push(updates.endTime);
            paramCount++;
        }

        if (fields.length === 0) {
            return this.findByIdAndUserId(id, userId);
        }

        // If either start_time or end_time is being updated, we need to recalculate duration
        if (updates.startTime !== undefined || updates.endTime !== undefined) {
            // First get the current entry to get the other time value
            const currentEntry = await this.findByIdAndUserId(id, userId);
            if (!currentEntry) {
                return null;
            }

            const startTime = updates.startTime || currentEntry.startTime;
            const endTime = updates.endTime || currentEntry.endTime;
            const duration = TimeEntryModel.calculateDuration(startTime, endTime);

            fields.push(`duration = $${paramCount}`);
            values.push(duration);
            paramCount++;
        }

        values.push(id, userId);

        const query = `
            UPDATE time_entries
            SET ${fields.join(', ')}
            WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
            RETURNING id, user_id, project_id, task_name, start_time, end_time, duration, created_at
        `;

        try {
            const result = await pool.query<DatabaseTimeEntry>(query, values);

            if (result.rows.length === 0) {
                return null;
            }

            return TimeEntryModel.fromDatabase(result.rows[0]!);
        } catch (error: any) {
            if (error.code === '23503') { // Foreign key constraint violation
                throw new Error('Invalid project ID');
            }
            if (error.code === '23514') { // Check constraint violation
                throw new Error('End time must be after start time');
            }
            throw error;
        }
    }

    /**
     * Delete time entry by ID and user ID
     */
    async delete(id: number, userId: string): Promise<boolean> {
        const query = `
            DELETE FROM time_entries
            WHERE id = $1 AND user_id = $2
        `;

        const result = await pool.query(query, [id, userId]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    /**
     * Get time entries for a date range
     */
    async findByDateRange(userId: string, startDate: string, endDate: string): Promise<TimeEntry[]> {
        const query = `
            SELECT id, user_id, project_id, task_name, start_time, end_time, duration, created_at
            FROM time_entries
            WHERE user_id = $1 AND DATE(start_time) >= $2 AND DATE(start_time) <= $3
            ORDER BY start_time DESC
        `;

        const result = await pool.query<DatabaseTimeEntry>(query, [userId, startDate, endDate]);
        return result.rows.map(row => TimeEntryModel.fromDatabase(row));
    }

    /**
     * Get total duration for a user on a specific date
     */
    async getTotalDurationByDate(userId: string, date: string): Promise<number> {
        const query = `
            SELECT COALESCE(SUM(duration), 0) as total_duration
            FROM time_entries
            WHERE user_id = $1 AND DATE(start_time) = $2
        `;

        const result = await pool.query(query, [userId, date]);
        return parseInt(result.rows[0]?.total_duration || '0');
    }

    /**
     * Get total duration grouped by project for a date range
     */
    async getTotalDurationByProject(userId: string, startDate: string, endDate: string): Promise<Array<{ projectId: number | null; projectName: string | null; totalDuration: number }>> {
        const query = `
            SELECT 
                te.project_id,
                p.name as project_name,
                SUM(te.duration) as total_duration
            FROM time_entries te
            LEFT JOIN projects p ON te.project_id = p.id
            WHERE te.user_id = $1 AND DATE(te.start_time) >= $2 AND DATE(te.start_time) <= $3
            GROUP BY te.project_id, p.name
            ORDER BY total_duration DESC
        `;

        const result = await pool.query(query, [userId, startDate, endDate]);
        return result.rows.map(row => ({
            projectId: row.project_id,
            projectName: row.project_name,
            totalDuration: parseInt(row.total_duration)
        }));
    }
}
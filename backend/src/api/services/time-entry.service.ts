import { TimeEntryRepository } from '../repositories/time-entry.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { TimeEntryModel } from '../models/time-entry.model';
import {
    TimeEntry,
    CreateTimeEntryData,
    UpdateTimeEntryData
} from '../../types';

export class TimeEntryService {
    private timeEntryRepository: TimeEntryRepository;
    private projectRepository: ProjectRepository;

    constructor() {
        this.timeEntryRepository = new TimeEntryRepository();
        this.projectRepository = new ProjectRepository();
    }

    /**
     * Create a new time entry for a user
     */
    async createTimeEntry(userId: string, timeEntryData: CreateTimeEntryData): Promise<TimeEntry> {
        // Validate time entry data
        const validation = TimeEntryModel.validateCreateData(timeEntryData);
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        // If project ID is provided, validate that the project belongs to the user
        if (timeEntryData.projectId) {
            const projectExists = await this.projectRepository.exists(timeEntryData.projectId, userId);
            if (!projectExists) {
                throw new Error('Project not found or access denied');
            }
        }

        // Create time entry
        const timeEntry = await this.timeEntryRepository.create(userId, timeEntryData);
        return timeEntry;
    }

    /**
     * Get time entries for a user with optional date filtering
     */
    async getUserTimeEntries(userId: string, date?: string, includeProjects: boolean = true): Promise<TimeEntry[]> {
        if (includeProjects) {
            return await this.timeEntryRepository.findByUserIdWithProjects(userId, date);
        } else {
            return await this.timeEntryRepository.findByUserId(userId, date);
        }
    }

    /**
     * Get a specific time entry by ID (ensures user owns the entry)
     */
    async getTimeEntryById(timeEntryId: number, userId: string): Promise<TimeEntry> {
        const timeEntry = await this.timeEntryRepository.findByIdAndUserId(timeEntryId, userId);
        if (!timeEntry) {
            throw new Error('Time entry not found or access denied');
        }
        return timeEntry;
    }

    /**
     * Update a time entry (ensures user owns the entry)
     */
    async updateTimeEntry(timeEntryId: number, userId: string, updates: UpdateTimeEntryData): Promise<TimeEntry> {
        // Validate update data
        const validation = TimeEntryModel.validateUpdateData(updates);
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        // Check if there are any actual updates
        if (Object.keys(updates).length === 0) {
            return await this.getTimeEntryById(timeEntryId, userId);
        }

        // If project ID is being updated, validate that the project belongs to the user
        if (updates.projectId !== undefined && updates.projectId !== null) {
            const projectExists = await this.projectRepository.exists(updates.projectId, userId);
            if (!projectExists) {
                throw new Error('Project not found or access denied');
            }
        }

        // If times are being updated, validate the time range
        if (updates.startTime !== undefined || updates.endTime !== undefined) {
            // Get current entry to validate time range
            const currentEntry = await this.timeEntryRepository.findByIdAndUserId(timeEntryId, userId);
            if (!currentEntry) {
                throw new Error('Time entry not found or access denied');
            }

            const startTime = updates.startTime || currentEntry.startTime;
            const endTime = updates.endTime || currentEntry.endTime;

            const timeValidation = TimeEntryModel.validateTimeRange(startTime, endTime);
            if (!timeValidation.isValid) {
                throw new Error(timeValidation.error!);
            }
        }

        // Update time entry
        const updatedTimeEntry = await this.timeEntryRepository.update(timeEntryId, userId, updates);
        if (!updatedTimeEntry) {
            throw new Error('Time entry not found or access denied');
        }

        return updatedTimeEntry;
    }

    /**
     * Delete a time entry (ensures user owns the entry)
     */
    async deleteTimeEntry(timeEntryId: number, userId: string): Promise<void> {
        const success = await this.timeEntryRepository.delete(timeEntryId, userId);
        if (!success) {
            throw new Error('Time entry not found or access denied');
        }
    }

    /**
     * Get time entries for a date range
     */
    async getTimeEntriesForDateRange(userId: string, startDate: string, endDate: string): Promise<TimeEntry[]> {
        return await this.timeEntryRepository.findByDateRange(userId, startDate, endDate);
    }

    /**
     * Get daily summary for a user
     */
    async getDailySummary(userId: string, date: string): Promise<{
        date: string;
        totalDuration: number;
        entries: TimeEntry[];
    }> {
        const [totalDuration, entries] = await Promise.all([
            this.timeEntryRepository.getTotalDurationByDate(userId, date),
            this.timeEntryRepository.findByUserIdWithProjects(userId, date)
        ]);

        return {
            date,
            totalDuration,
            entries
        };
    }

    /**
     * Get weekly summary for a user
     */
    async getWeeklySummary(userId: string, startDate: string, endDate: string): Promise<{
        startDate: string;
        endDate: string;
        totalDuration: number;
        projectBreakdown: Array<{ projectId: number | null; projectName: string | null; totalDuration: number }>;
        entries: TimeEntry[];
    }> {
        const [projectBreakdown, entries] = await Promise.all([
            this.timeEntryRepository.getTotalDurationByProject(userId, startDate, endDate),
            this.timeEntryRepository.findByDateRange(userId, startDate, endDate)
        ]);

        const totalDuration = projectBreakdown.reduce((sum, project) => sum + project.totalDuration, 0);

        return {
            startDate,
            endDate,
            totalDuration,
            projectBreakdown,
            entries
        };
    }

    /**
     * Validate time entry data before creation/update
     */
    private validateTimeEntry(data: CreateTimeEntryData | UpdateTimeEntryData): void {
        if ('startTime' in data && 'endTime' in data && data.startTime && data.endTime) {
            const timeValidation = TimeEntryModel.validateTimeRange(data.startTime, data.endTime);
            if (!timeValidation.isValid) {
                throw new Error(timeValidation.error!);
            }
        }
    }
}

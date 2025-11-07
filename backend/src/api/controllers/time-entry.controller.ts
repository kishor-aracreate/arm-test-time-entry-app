import { Request, Response } from 'express';
import { TimeEntryService } from '../services/time-entry.service';
import { CreateTimeEntryData, UpdateTimeEntryData, ApiResponse, TimeEntry } from '../../types';

export class TimeEntryController {
    private timeEntryService: TimeEntryService;

    constructor() {
        this.timeEntryService = new TimeEntryService();
    }

    /**
     * GET /api/time-entries
     * Get time entries for the user with optional date filtering
     */
    getTimeEntries = async (req: Request, res: Response<ApiResponse<TimeEntry[]>>): Promise<void> => {
        try {
            const date = req.query.date as string | undefined;
            const includeProjects = req.query.includeProjects !== 'false'; // Default to true

            const timeEntries = await this.timeEntryService.getUserTimeEntries(req.user.id, date, includeProjects);

            res.status(200).json({
                success: true,
                data: timeEntries
            });
        } catch (error: any) {
            console.error('Get time entries error:', error);

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch time entries',
                    code: 'FETCH_TIME_ENTRIES_ERROR',
                    details: error.message
                }
            });
        }
    };

    /**
     * POST /api/time-entries
     * Create a new time entry
     */
    createTimeEntry = async (req: Request, res: Response<ApiResponse<TimeEntry>>): Promise<void> => {
        try {
            const timeEntryData: CreateTimeEntryData = {
                ...req.body,
                startTime: new Date(req.body.startTime),
                endTime: new Date(req.body.endTime)
            };

            const timeEntry = await this.timeEntryService.createTimeEntry(req.user.id, timeEntryData);

            res.status(201).json({
                success: true,
                data: timeEntry
            });
        } catch (error: any) {
            console.error('Create time entry error:', error);

            if (error.message.includes('Validation failed') || error.message.includes('End time must be after start time')) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 'VALIDATION_ERROR'
                    }
                });
                return;
            }

            if (error.message.includes('Project not found') || error.message.includes('access denied')) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Project not found or access denied',
                        code: 'PROJECT_NOT_FOUND'
                    }
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to create time entry',
                    code: 'CREATE_TIME_ENTRY_ERROR',
                    details: error.message
                }
            });
        }
    };

    /**
     * GET /api/time-entries/:id
     * Get a specific time entry by ID
     */
    getTimeEntry = async (req: Request, res: Response<ApiResponse<TimeEntry>>): Promise<void> => {
        try {
            const timeEntryIdParam = req.params.id;
            if (!timeEntryIdParam) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Time entry ID is required',
                        code: 'MISSING_TIME_ENTRY_ID'
                    }
                });
                return;
            }

            const timeEntryId = parseInt(timeEntryIdParam, 10);
            if (isNaN(timeEntryId)) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid time entry ID',
                        code: 'INVALID_TIME_ENTRY_ID'
                    }
                });
                return;
            }

            const timeEntry = await this.timeEntryService.getTimeEntryById(timeEntryId, req.user.id);

            res.status(200).json({
                success: true,
                data: timeEntry
            });
        } catch (error: any) {
            console.error('Get time entry error:', error);

            if (error.message.includes('not found') || error.message.includes('access denied')) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Time entry not found',
                        code: 'TIME_ENTRY_NOT_FOUND'
                    }
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch time entry',
                    code: 'FETCH_TIME_ENTRY_ERROR',
                    details: error.message
                }
            });
        }
    };

    /**
     * PUT /api/time-entries/:id
     * Update a time entry
     */
    updateTimeEntry = async (req: Request, res: Response<ApiResponse<TimeEntry>>): Promise<void> => {
        try {
            const timeEntryIdParam = req.params.id;
            if (!timeEntryIdParam) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Time entry ID is required',
                        code: 'MISSING_TIME_ENTRY_ID'
                    }
                });
                return;
            }

            const timeEntryId = parseInt(timeEntryIdParam, 10);
            if (isNaN(timeEntryId)) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid time entry ID',
                        code: 'INVALID_TIME_ENTRY_ID'
                    }
                });
                return;
            }

            const updates: UpdateTimeEntryData = { ...req.body };

            // Convert date strings to Date objects if provided
            if (updates.startTime) {
                updates.startTime = new Date(updates.startTime);
            }
            if (updates.endTime) {
                updates.endTime = new Date(updates.endTime);
            }

            const timeEntry = await this.timeEntryService.updateTimeEntry(timeEntryId, req.user.id, updates);

            res.status(200).json({
                success: true,
                data: timeEntry
            });
        } catch (error: any) {
            console.error('Update time entry error:', error);

            if (error.message.includes('not found') || error.message.includes('access denied')) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Time entry not found',
                        code: 'TIME_ENTRY_NOT_FOUND'
                    }
                });
                return;
            }

            if (error.message.includes('Validation failed') || error.message.includes('End time must be after start time')) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 'VALIDATION_ERROR'
                    }
                });
                return;
            }

            if (error.message.includes('Project not found')) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Project not found or access denied',
                        code: 'PROJECT_NOT_FOUND'
                    }
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to update time entry',
                    code: 'UPDATE_TIME_ENTRY_ERROR',
                    details: error.message
                }
            });
        }
    };

    /**
     * DELETE /api/time-entries/:id
     * Delete a time entry
     */
    deleteTimeEntry = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
        try {
            const timeEntryIdParam = req.params.id;
            if (!timeEntryIdParam) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Time entry ID is required',
                        code: 'MISSING_TIME_ENTRY_ID'
                    }
                });
                return;
            }

            const timeEntryId = parseInt(timeEntryIdParam, 10);
            if (isNaN(timeEntryId)) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid time entry ID',
                        code: 'INVALID_TIME_ENTRY_ID'
                    }
                });
                return;
            }

            await this.timeEntryService.deleteTimeEntry(timeEntryId, req.user.id);

            res.status(200).json({
                success: true,
                data: {
                    message: 'Time entry deleted successfully'
                }
            });
        } catch (error: any) {
            console.error('Delete time entry error:', error);

            if (error.message.includes('not found') || error.message.includes('access denied')) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Time entry not found',
                        code: 'TIME_ENTRY_NOT_FOUND'
                    }
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to delete time entry',
                    code: 'DELETE_TIME_ENTRY_ERROR',
                    details: error.message
                }
            });
        }
    };

    /**
     * GET /api/time-entries/summary/daily
     * Get daily summary for a specific date
     */
    getDailySummary = async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
        try {
            const date = req.query.date as string;
            if (!date) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Date parameter is required (YYYY-MM-DD format)',
                        code: 'MISSING_DATE'
                    }
                });
                return;
            }

            const summary = await this.timeEntryService.getDailySummary(req.user.id, date);

            res.status(200).json({
                success: true,
                data: summary
            });
        } catch (error: any) {
            console.error('Get daily summary error:', error);

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch daily summary',
                    code: 'FETCH_DAILY_SUMMARY_ERROR',
                    details: error.message
                }
            });
        }
    };

    /**
     * GET /api/time-entries/summary/weekly
     * Get weekly summary for a date range
     */
    getWeeklySummary = async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
        try {
            const startDate = req.query.startDate as string;
            const endDate = req.query.endDate as string;

            if (!startDate || !endDate) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Both startDate and endDate parameters are required (YYYY-MM-DD format)',
                        code: 'MISSING_DATE_RANGE'
                    }
                });
                return;
            }

            const summary = await this.timeEntryService.getWeeklySummary(req.user.id, startDate, endDate);

            res.status(200).json({
                success: true,
                data: summary
            });
        } catch (error: any) {
            console.error('Get weekly summary error:', error);

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch weekly summary',
                    code: 'FETCH_WEEKLY_SUMMARY_ERROR',
                    details: error.message
                }
            });
        }
    };
}
import { Request, Response } from 'express';
import { ActiveTimerService } from '../services/active-timer.service';
import { ApiResponse, StartTimerData } from '../../types';

export class TimerController {
    private activeTimerService: ActiveTimerService;

    constructor() {
        this.activeTimerService = new ActiveTimerService();
    }

    /**
     * Start a new timer
     * POST /api/timer/start
     */
    startTimer = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;

            const timerData: StartTimerData = {
                taskName: req.body.taskName,
                projectId: req.body.projectId
            };

            const activeTimer = await this.activeTimerService.startTimer(userId, timerData);

            res.status(201).json({
                success: true,
                data: activeTimer
            } as ApiResponse);
        } catch (error: any) {
            console.error('Error starting timer:', error);

            // Handle specific error cases
            if (error.message.includes('Validation failed')) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 'VALIDATION_ERROR'
                    }
                } as ApiResponse);
                return;
            }

            if (error.message.includes('Project not found')) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 'PROJECT_NOT_FOUND'
                    }
                } as ApiResponse);
                return;
            }

            if (error.message.includes('already has an active timer')) {
                res.status(409).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 'TIMER_ALREADY_ACTIVE'
                    }
                } as ApiResponse);
                return;
            }

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to start timer',
                    code: 'INTERNAL_ERROR'
                }
            } as ApiResponse);
        }
    };

    /**
     * Stop the active timer
     * POST /api/timer/stop
     */
    stopTimer = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;

            const result = await this.activeTimerService.stopTimer(userId);

            res.status(200).json({
                success: true,
                data: {
                    timeEntry: result.timeEntry,
                    stoppedTimer: result.stoppedTimer
                }
            } as ApiResponse);
        } catch (error: any) {
            console.error('Error stopping timer:', error);

            if (error.message.includes('No active timer found')) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 'NO_ACTIVE_TIMER'
                    }
                } as ApiResponse);
                return;
            }

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to stop timer',
                    code: 'INTERNAL_ERROR'
                }
            } as ApiResponse);
        }
    };

    /**
     * Get the current active timer
     * GET /api/timer/active
     */
    getActiveTimer = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;

            const activeTimer = await this.activeTimerService.getActiveTimer(userId, true);

            if (!activeTimer) {
                res.status(200).json({
                    success: true,
                    data: null
                } as ApiResponse);
                return;
            }

            // Calculate elapsed time
            const elapsedTime = await this.activeTimerService.getElapsedTime(userId);

            res.status(200).json({
                success: true,
                data: {
                    ...activeTimer,
                    elapsedTime
                }
            } as ApiResponse);
        } catch (error: any) {
            console.error('Error getting active timer:', error);

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to get active timer',
                    code: 'INTERNAL_ERROR'
                }
            } as ApiResponse);
        }
    };
}
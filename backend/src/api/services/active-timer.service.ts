import { ActiveTimerRepository } from '../repositories/active-timer.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { ActiveTimerModel } from '../models/active-timer.model';
import { ActiveTimer, StartTimerData, TimeEntry } from '../../types';

export class ActiveTimerService {
    private activeTimerRepository: ActiveTimerRepository;
    private projectRepository: ProjectRepository;

    constructor() {
        this.activeTimerRepository = new ActiveTimerRepository();
        this.projectRepository = new ProjectRepository();
    }

    /**
     * Start a new timer for a user
     * Enforces single active timer per user constraint
     */
    async startTimer(userId: number, timerData: StartTimerData): Promise<ActiveTimer> {
        // Validate timer data
        const validation = ActiveTimerModel.validateStartData(timerData);
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        // If project ID is provided, validate that the project belongs to the user
        if (timerData.projectId) {
            const projectExists = await this.projectRepository.exists(timerData.projectId, userId);
            if (!projectExists) {
                throw new Error('Project not found or access denied');
            }
        }

        // Check if user already has an active timer
        const hasActiveTimer = await this.activeTimerRepository.hasActiveTimer(userId);
        if (hasActiveTimer) {
            throw new Error('User already has an active timer. Stop the current timer before starting a new one.');
        }

        // Start the timer
        const activeTimer = await this.activeTimerRepository.startTimer(userId, timerData);
        return activeTimer;
    }

    /**
     * Stop the active timer for a user and create a time entry
     */
    async stopTimer(userId: number): Promise<{ timeEntry: TimeEntry; stoppedTimer: ActiveTimer }> {
        const result = await this.activeTimerRepository.stopTimer(userId);

        if (!result) {
            throw new Error('No active timer found for user');
        }

        return result;
    }

    /**
     * Get the current active timer for a user
     */
    async getActiveTimer(userId: number, includeProject: boolean = true): Promise<ActiveTimer | null> {
        if (includeProject) {
            return await this.activeTimerRepository.findByUserIdWithProject(userId);
        } else {
            return await this.activeTimerRepository.findByUserId(userId);
        }
    }

    /**
     * Check if user has an active timer
     */
    async hasActiveTimer(userId: number): Promise<boolean> {
        return await this.activeTimerRepository.hasActiveTimer(userId);
    }

    /**
     * Get elapsed time for the active timer
     */
    async getElapsedTime(userId: number): Promise<number | null> {
        const activeTimer = await this.activeTimerRepository.findByUserId(userId);

        if (!activeTimer) {
            return null;
        }

        return ActiveTimerModel.calculateElapsedTime(activeTimer.startTime);
    }
}
/**
 * Zustand Store
 * ---------------------------------------------------------------------------
 * Central state management for the Timer App using Zustand.
 * Manages timer state, projects, and time entries.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
    Project,
    TimeEntry,
    ActiveTimer,
    StartTimerData,
    CreateProjectData,
    CreateTimeEntryData,
    UpdateTimeEntryData,
} from './types';

interface AppState {
    // Timer state
    activeTimer: ActiveTimer | null;
    elapsedTime: number;

    // Data state
    projects: Project[];
    timeEntries: TimeEntry[];

    // UI state
    isLoading: boolean;
    isInitialLoading: boolean;
    error: string | null;

    // Timer actions
    startTimer: (timerData: StartTimerData) => Promise<void>;
    stopTimer: () => Promise<void>;
    fetchActiveTimer: () => Promise<void>;
    setActiveTimer: (timer: ActiveTimer | null) => void;
    setElapsedTime: (time: number) => void;
    updateElapsedTime: () => void;

    // Project actions
    fetchProjects: () => Promise<void>;
    createProject: (project: CreateProjectData) => Promise<void>;
    updateProject: (id: number, project: Partial<CreateProjectData>) => Promise<void>;
    deleteProject: (id: number) => Promise<void>;
    setProjects: (projects: Project[]) => void;

    // Time entry actions
    fetchTimeEntries: (date?: string) => Promise<void>;
    createTimeEntry: (entry: CreateTimeEntryData) => Promise<void>;
    updateTimeEntry: (id: number, entry: UpdateTimeEntryData) => Promise<void>;
    deleteTimeEntry: (id: number) => Promise<void>;
    setTimeEntries: (entries: TimeEntry[]) => void;

    // UI actions
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useAppStore = create<AppState>()(
    devtools(
        (set, get) => ({
            // Initial state
            activeTimer: null,
            elapsedTime: 0,
            projects: [],
            timeEntries: [],
            isLoading: false,
            isInitialLoading: true,
            error: null,

            // Timer actions
            startTimer: async (timerData: StartTimerData) => {
                set({ isLoading: true, error: null });
                try {
                    const { apiService } = await import('@/lib/api');
                    const activeTimer = await apiService.startTimer(timerData);

                    // Set the active timer and start elapsed time tracking
                    set({
                        activeTimer,
                        elapsedTime: 0,
                        isLoading: false
                    });
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.message || 'Failed to start timer'
                    });
                    throw error;
                }
            },

            stopTimer: async () => {
                set({ isLoading: true, error: null });
                try {
                    const { apiService } = await import('@/lib/api');
                    await apiService.stopTimer();

                    // Clear summary cache when timer stops (creates new time entry)
                    const { clearSummaryCache } = await import('@/utils/time');
                    clearSummaryCache();

                    // Clear the active timer and elapsed time
                    set({
                        activeTimer: null,
                        elapsedTime: 0,
                        isLoading: false
                    });
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.message || 'Failed to stop timer'
                    });
                    throw error;
                }
            },

            fetchActiveTimer: async () => {
                try {
                    const { apiService } = await import('@/lib/api');
                    const activeTimer = await apiService.getActiveTimer();

                    if (activeTimer) {
                        // Calculate elapsed time from start time
                        const elapsed = Math.floor((Date.now() - new Date(activeTimer.startTime).getTime()) / 1000);
                        set({
                            activeTimer,
                            elapsedTime: elapsed
                        });
                    } else {
                        set({
                            activeTimer: null,
                            elapsedTime: 0
                        });
                    }
                } catch (error: any) {
                    // Don't set error for this background operation
                    console.error('Failed to fetch active timer:', error);
                    set({
                        activeTimer: null,
                        elapsedTime: 0
                    });
                }
            },

            setActiveTimer: (timer: ActiveTimer | null) => set({ activeTimer: timer }),
            setElapsedTime: (time: number) => set({ elapsedTime: time }),

            updateElapsedTime: () => {
                const { activeTimer } = get();
                if (activeTimer) {
                    const elapsed = Math.floor((Date.now() - new Date(activeTimer.startTime).getTime()) / 1000);
                    set({ elapsedTime: elapsed });
                }
            },

            // Project actions
            fetchProjects: async () => {
                const { projects, isInitialLoading } = get();
                // Only show loading on initial fetch
                if (projects.length === 0 && isInitialLoading) {
                    set({ isLoading: true, error: null });
                }
                try {
                    const { apiService } = await import('@/lib/api');
                    const fetchedProjects = await apiService.getProjects();
                    set({
                        projects: fetchedProjects,
                        isLoading: false,
                        isInitialLoading: false
                    });
                } catch (error: any) {
                    set({
                        isLoading: false,
                        isInitialLoading: false,
                        error: error.message || 'Failed to fetch projects'
                    });
                }
            },

            createProject: async (project: CreateProjectData) => {
                set({ isLoading: true, error: null });
                try {
                    const { apiService } = await import('@/lib/api');
                    const newProject = await apiService.createProject(project);

                    // Optimistic update: add the new project to the list
                    const { projects } = get();
                    set({
                        projects: [...projects, newProject],
                        isLoading: false
                    });
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.message || 'Failed to create project'
                    });
                    throw error;
                }
            },

            updateProject: async (id: number, project: Partial<CreateProjectData>) => {
                set({ isLoading: true, error: null });
                try {
                    const { apiService } = await import('@/lib/api');
                    const updatedProject = await apiService.updateProject(id, project);

                    // Optimistic update: update the project in the list
                    const { projects } = get();
                    const updatedProjects = projects.map(p =>
                        p.id === id ? updatedProject : p
                    );
                    set({
                        projects: updatedProjects,
                        isLoading: false
                    });
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.message || 'Failed to update project'
                    });
                    throw error;
                }
            },

            deleteProject: async (id: number) => {
                set({ isLoading: true, error: null });
                try {
                    const { apiService } = await import('@/lib/api');
                    await apiService.deleteProject(id);

                    // Optimistic update: remove the project from the list
                    const { projects } = get();
                    const filteredProjects = projects.filter(p => p.id !== id);
                    set({
                        projects: filteredProjects,
                        isLoading: false
                    });
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.message || 'Failed to delete project'
                    });
                    throw error;
                }
            },

            setProjects: (projects: Project[]) => set({ projects }),

            // Time entry actions
            fetchTimeEntries: async (date?: string) => {
                const { timeEntries, isInitialLoading } = get();
                // Only show loading on initial fetch
                if (timeEntries.length === 0 && isInitialLoading) {
                    set({ isLoading: true, error: null });
                }
                try {
                    const { apiService } = await import('@/lib/api');
                    const fetchedTimeEntries = await apiService.getTimeEntries(date);

                    // Clear summary cache when time entries change
                    const { clearSummaryCache } = await import('@/utils/time');
                    clearSummaryCache();

                    set({
                        timeEntries: fetchedTimeEntries,
                        isLoading: false,
                        isInitialLoading: false
                    });
                } catch (error: any) {
                    set({
                        isLoading: false,
                        isInitialLoading: false,
                        error: error.message || 'Failed to fetch time entries'
                    });
                }
            },

            createTimeEntry: async (entry: CreateTimeEntryData) => {
                set({ isLoading: true, error: null });
                try {
                    const { apiService } = await import('@/lib/api');
                    const newTimeEntry = await apiService.createTimeEntry(entry);

                    // Clear summary cache when time entries change
                    const { clearSummaryCache } = await import('@/utils/time');
                    clearSummaryCache();

                    // Optimistic update: add the new time entry to the list
                    const { timeEntries } = get();
                    set({
                        timeEntries: [newTimeEntry, ...timeEntries],
                        isLoading: false
                    });
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.message || 'Failed to create time entry'
                    });
                    throw error;
                }
            },

            updateTimeEntry: async (id: number, entry: UpdateTimeEntryData) => {
                set({ isLoading: true, error: null });
                try {
                    const { apiService } = await import('@/lib/api');
                    const updatedTimeEntry = await apiService.updateTimeEntry(id, entry);

                    // Optimistic update: update the time entry in the list
                    const { timeEntries } = get();
                    const updatedTimeEntries = timeEntries.map(te =>
                        te.id === id ? updatedTimeEntry : te
                    );
                    set({
                        timeEntries: updatedTimeEntries,
                        isLoading: false
                    });
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.message || 'Failed to update time entry'
                    });
                    throw error;
                }
            },

            deleteTimeEntry: async (id: number) => {
                set({ isLoading: true, error: null });
                try {
                    const { apiService } = await import('@/lib/api');
                    await apiService.deleteTimeEntry(id);

                    // Optimistic update: remove the time entry from the list
                    const { timeEntries } = get();
                    const filteredTimeEntries = timeEntries.filter(te => te.id !== id);
                    set({
                        timeEntries: filteredTimeEntries,
                        isLoading: false
                    });
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.message || 'Failed to delete time entry'
                    });
                    throw error;
                }
            },

            setTimeEntries: (entries: TimeEntry[]) => set({ timeEntries: entries }),

            // UI actions
            setLoading: (loading: boolean) => set({ isLoading: loading }),
            setError: (error: string | null) => set({ error }),
            clearError: () => set({ error: null }),
        }),
        {
            name: 'timer-app-store',
        }
    )
);

export type { AppState };
export * from './types';
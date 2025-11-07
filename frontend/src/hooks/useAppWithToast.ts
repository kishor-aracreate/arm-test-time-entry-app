/**
 * useAppWithToast Hook
 * ---------------------------------------------------------------------------
 * Enhanced version of the app store that integrates with toast notifications.
 * Automatically shows success/error toasts for various operations.
 */

import { useCallback } from 'react';
import { useAppStore } from '@/store';
import { useToastContext } from '@/components/providers/ToastProvider';
import type {
    StartTimerData,
    CreateProjectData,
    CreateTimeEntryData,
    UpdateTimeEntryData,
} from '@/store/types';

export const useAppWithToast = () => {
    const store = useAppStore();
    const toast = useToastContext();



    // Enhanced timer actions with toast notifications
    const startTimer = useCallback(async (timerData: StartTimerData) => {
        try {
            await store.startTimer(timerData);
            toast.success({
                title: 'Timer Started',
                message: `Started tracking "${timerData.taskName}"`,
                duration: 3000,
            });
        } catch (error: any) {
            toast.error({
                title: 'Failed to Start Timer',
                message: error.message || 'Please try again.',
            });
            throw error;
        }
    }, [store.startTimer, toast]);

    const stopTimer = useCallback(async () => {
        try {
            const activeTimer = store.activeTimer;
            await store.stopTimer();

            if (activeTimer) {
                const duration = Math.floor((Date.now() - new Date(activeTimer.startTime).getTime()) / 1000);
                const hours = Math.floor(duration / 3600);
                const minutes = Math.floor((duration % 3600) / 60);
                const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

                toast.success({
                    title: 'Timer Stopped',
                    message: `Tracked ${timeStr} for "${activeTimer.taskName}"`,
                    duration: 4000,
                });
            }
        } catch (error: any) {
            toast.error({
                title: 'Failed to Stop Timer',
                message: error.message || 'Please try again.',
            });
            throw error;
        }
    }, [store.stopTimer, store.activeTimer, toast]);

    // Enhanced project actions with toast notifications
    const createProject = useCallback(async (project: CreateProjectData) => {
        try {
            await store.createProject(project);
            toast.success({
                title: 'Project Created',
                message: `"${project.name}" has been created successfully.`,
                duration: 3000,
            });
        } catch (error: any) {
            toast.error({
                title: 'Failed to Create Project',
                message: error.message || 'Please try again.',
            });
            throw error;
        }
    }, [store.createProject, toast]);

    const updateProject = useCallback(async (id: number, project: Partial<CreateProjectData>) => {
        try {
            await store.updateProject(id, project);
            toast.success({
                title: 'Project Updated',
                message: project.name ? `"${project.name}" has been updated.` : 'Project has been updated.',
                duration: 3000,
            });
        } catch (error: any) {
            toast.error({
                title: 'Failed to Update Project',
                message: error.message || 'Please try again.',
            });
            throw error;
        }
    }, [store.updateProject, toast]);

    const deleteProject = useCallback(async (id: number) => {
        try {
            const project = store.projects.find(p => p.id === id);
            await store.deleteProject(id);
            toast.success({
                title: 'Project Deleted',
                message: project ? `"${project.name}" has been deleted.` : 'Project has been deleted.',
                duration: 3000,
            });
        } catch (error: any) {
            toast.error({
                title: 'Failed to Delete Project',
                message: error.message || 'Please try again.',
            });
            throw error;
        }
    }, [store.deleteProject, store.projects, toast]);

    // Enhanced time entry actions with toast notifications
    const createTimeEntry = useCallback(async (entry: CreateTimeEntryData) => {
        try {
            await store.createTimeEntry(entry);
            toast.success({
                title: 'Time Entry Created',
                message: `Added entry for "${entry.taskName}"`,
                duration: 3000,
            });
        } catch (error: any) {
            toast.error({
                title: 'Failed to Create Time Entry',
                message: error.message || 'Please try again.',
            });
            throw error;
        }
    }, [store.createTimeEntry, toast]);

    const updateTimeEntry = useCallback(async (id: number, entry: UpdateTimeEntryData) => {
        try {
            await store.updateTimeEntry(id, entry);
            toast.success({
                title: 'Time Entry Updated',
                message: 'Time entry has been updated successfully.',
                duration: 3000,
            });
        } catch (error: any) {
            toast.error({
                title: 'Failed to Update Time Entry',
                message: error.message || 'Please try again.',
            });
            throw error;
        }
    }, [store.updateTimeEntry, toast]);

    const deleteTimeEntry = useCallback(async (id: number) => {
        try {
            await store.deleteTimeEntry(id);
            toast.success({
                title: 'Time Entry Deleted',
                message: 'Time entry has been deleted.',
                duration: 3000,
            });
        } catch (error: any) {
            toast.error({
                title: 'Failed to Delete Time Entry',
                message: error.message || 'Please try again.',
            });
            throw error;
        }
    }, [store.deleteTimeEntry, toast]);

    // Return enhanced store with toast-integrated actions
    return {
        ...store,
        // Override actions with toast-enhanced versions
        startTimer,
        stopTimer,
        createProject,
        updateProject,
        deleteProject,
        createTimeEntry,
        updateTimeEntry,
        deleteTimeEntry,
    };
};
/**
 * Real-time Updates Hook
 * ---------------------------------------------------------------------------
 * Custom hook for managing real-time updates in dashboard components.
 */

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store';

/**
 * Hook for real-time timer updates
 * Updates elapsed time and triggers re-renders when timer is active
 */
export const useRealTimeUpdates = (intervalMs: number = 1000) => {
    const store = useAppStore();
    const { activeTimer } = store;
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (activeTimer) {
            // Update immediately
            store.updateElapsedTime();

            // Set up interval for continuous updates
            intervalRef.current = setInterval(() => {
                store.updateElapsedTime();
            }, intervalMs);
        } else {
            // Clear interval when no active timer
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        // Cleanup on unmount or dependency change
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [activeTimer, intervalMs]); // Only depend on activeTimer and intervalMs

    return { activeTimer };
};

/**
 * Hook for periodic data refresh
 * Refreshes time entries and projects at specified intervals
 */
export const usePeriodicRefresh = (intervalMs: number = 60000) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Set up interval for periodic refresh
        intervalRef.current = setInterval(async () => {
            try {
                const store = useAppStore.getState();
                // Only refresh if not currently loading to prevent conflicts
                if (!store.isLoading) {
                    await Promise.all([
                        store.fetchTimeEntries(),
                        store.fetchProjects()
                    ]);
                }
            } catch (error) {
                console.warn('Periodic refresh failed:', error);
            }
        }, intervalMs);

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [intervalMs]);
};
/**
 * Time Utilities
 * ---------------------------------------------------------------------------
 * Utility functions for time calculations and formatting.
 */

import type { TimeEntry, ActiveTimer, Project } from '@/types';

/**
 * Format duration in seconds to human readable format
 */
export const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
};

/**
 * Get start and end of day for a given date
 */
export const getDayBounds = (date: Date = new Date()) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return { start, end };
};

/**
 * Get start and end of week for a given date
 */
export const getWeekBounds = (date: Date = new Date()) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
};

/**
 * Filter time entries by date range
 */
export const filterEntriesByDateRange = (
    entries: TimeEntry[],
    startDate: Date,
    endDate: Date
): TimeEntry[] => {
    return entries.filter(entry => {
        const entryDate = new Date(entry.startTime);
        return entryDate >= startDate && entryDate <= endDate;
    });
};

/**
 * Calculate total duration for time entries
 */
export const calculateTotalDuration = (entries: TimeEntry[]): number => {
    return entries.reduce((total, entry) => total + entry.duration, 0);
};

/**
 * Group time entries by project
 */
export const groupEntriesByProject = (
    entries: TimeEntry[],
    projects: Project[]
): Array<{
    project: Project | null;
    entries: TimeEntry[];
    totalDuration: number;
}> => {
    const grouped = entries.reduce((acc, entry) => {
        const projectId = entry.projectId || 'no-project';
        if (!acc[projectId]) {
            acc[projectId] = [];
        }
        acc[projectId].push(entry);
        return acc;
    }, {} as Record<string, TimeEntry[]>);

    return Object.entries(grouped).map(([projectId, entries]) => {
        const project = projectId === 'no-project'
            ? null
            : projects.find(p => p.id === parseInt(projectId)) || null;

        return {
            project,
            entries,
            totalDuration: calculateTotalDuration(entries),
        };
    }).sort((a, b) => b.totalDuration - a.totalDuration);
};

/**
 * Calculate current elapsed time for active timer
 */
export const calculateElapsedTime = (activeTimer: ActiveTimer | null): number => {
    if (!activeTimer) return 0;
    return Math.floor((Date.now() - new Date(activeTimer.startTime).getTime()) / 1000);
};

/**
 * Get today's summary data
 */
export const getTodaySummary = (
    timeEntries: TimeEntry[],
    activeTimer: ActiveTimer | null,
    elapsedTime: number,
    projects: Project[]
) => {
    const { start, end } = getDayBounds();
    const todayEntries = filterEntriesByDateRange(timeEntries, start, end);

    // Calculate total time including active timer
    const entriesTotal = calculateTotalDuration(todayEntries);
    const activeTimerDuration = activeTimer ? elapsedTime : 0;
    const totalTime = entriesTotal + activeTimerDuration;

    // Group by project
    const projectGroups = groupEntriesByProject(todayEntries, projects);

    // Add active timer to project groups if running
    if (activeTimer && activeTimerDuration > 0) {
        const activeProject = activeTimer.projectId
            ? projects.find(p => p.id === activeTimer.projectId) || null
            : null;

        const existingGroup = projectGroups.find(g =>
            (g.project?.id || null) === (activeProject?.id || null)
        );

        if (existingGroup) {
            existingGroup.totalDuration += activeTimerDuration;
        } else {
            projectGroups.unshift({
                project: activeProject,
                entries: [],
                totalDuration: activeTimerDuration,
            });
        }

        // Re-sort after adding active timer
        projectGroups.sort((a, b) => b.totalDuration - a.totalDuration);
    }

    return {
        totalTime,
        entriesCount: todayEntries.length,
        projectGroups,
        todayEntries,
    };
};

/**
 * Get weekly summary data
 */
export const getWeeklySummary = (
    timeEntries: TimeEntry[],
    activeTimer: ActiveTimer | null,
    elapsedTime: number,
    projects: Project[]
) => {
    const { start, end } = getWeekBounds();
    const weekEntries = filterEntriesByDateRange(timeEntries, start, end);

    // Calculate total time including active timer if it's today
    const entriesTotal = calculateTotalDuration(weekEntries);
    const today = new Date();
    const isActiveTimerToday = activeTimer &&
        today >= start && today <= end;
    const activeTimerDuration = isActiveTimerToday ? elapsedTime : 0;
    const totalTime = entriesTotal + activeTimerDuration;

    // Group by project
    const projectGroups = groupEntriesByProject(weekEntries, projects);

    // Add active timer to project groups if running today
    if (activeTimer && activeTimerDuration > 0) {
        const activeProject = activeTimer.projectId
            ? projects.find(p => p.id === activeTimer.projectId) || null
            : null;

        const existingGroup = projectGroups.find(g =>
            (g.project?.id || null) === (activeProject?.id || null)
        );

        if (existingGroup) {
            existingGroup.totalDuration += activeTimerDuration;
        } else {
            projectGroups.unshift({
                project: activeProject,
                entries: [],
                totalDuration: activeTimerDuration,
            });
        }

        // Re-sort after adding active timer
        projectGroups.sort((a, b) => b.totalDuration - a.totalDuration);
    }

    return {
        totalTime,
        entriesCount: weekEntries.length,
        projectGroups,
        weekEntries,
    };
};
/**
 * 
Memoized summary calculations for performance
 * Uses simple caching to avoid recalculating when data hasn't changed
 */
let summaryCache: {
    todayKey?: string;
    todayResult?: ReturnType<typeof getTodaySummary>;
    weekKey?: string;
    weekResult?: ReturnType<typeof getWeeklySummary>;
} = {};

export const getMemoizedTodaySummary = (
    timeEntries: TimeEntry[],
    activeTimer: ActiveTimer | null,
    elapsedTime: number,
    projects: Project[]
) => {
    // Create cache key based on data that affects the result
    const cacheKey = `${timeEntries.length}-${activeTimer?.id || 'none'}-${Math.floor(elapsedTime / 10)}-${projects.length}`;

    if (summaryCache.todayKey === cacheKey && summaryCache.todayResult) {
        // Update elapsed time in cached result for real-time updates
        const cached = { ...summaryCache.todayResult };
        if (activeTimer) {
            const entriesTotal = calculateTotalDuration(summaryCache.todayResult.todayEntries);
            cached.totalTime = entriesTotal + elapsedTime;

            // Update project groups with current elapsed time
            cached.projectGroups = cached.projectGroups.map(group => {
                if (activeTimer.projectId === group.project?.id || (!activeTimer.projectId && !group.project)) {
                    return {
                        ...group,
                        totalDuration: group.totalDuration - (summaryCache.todayResult!.totalTime - entriesTotal) + elapsedTime
                    };
                }
                return group;
            });
        }
        return cached;
    }

    const result = getTodaySummary(timeEntries, activeTimer, elapsedTime, projects);
    summaryCache.todayKey = cacheKey;
    summaryCache.todayResult = result;

    return result;
};

export const getMemoizedWeeklySummary = (
    timeEntries: TimeEntry[],
    activeTimer: ActiveTimer | null,
    elapsedTime: number,
    projects: Project[]
) => {
    // Create cache key based on data that affects the result
    const cacheKey = `${timeEntries.length}-${activeTimer?.id || 'none'}-${Math.floor(elapsedTime / 10)}-${projects.length}`;

    if (summaryCache.weekKey === cacheKey && summaryCache.weekResult) {
        // Update elapsed time in cached result for real-time updates
        const cached = { ...summaryCache.weekResult };
        if (activeTimer) {
            const entriesTotal = calculateTotalDuration(summaryCache.weekResult.weekEntries);
            const today = new Date();
            const { start, end } = getWeekBounds();
            const isActiveTimerToday = today >= start && today <= end;

            if (isActiveTimerToday) {
                cached.totalTime = entriesTotal + elapsedTime;

                // Update project groups with current elapsed time
                cached.projectGroups = cached.projectGroups.map(group => {
                    if (activeTimer.projectId === group.project?.id || (!activeTimer.projectId && !group.project)) {
                        return {
                            ...group,
                            totalDuration: group.totalDuration - (summaryCache.weekResult!.totalTime - entriesTotal) + elapsedTime
                        };
                    }
                    return group;
                });
            }
        }
        return cached;
    }

    const result = getWeeklySummary(timeEntries, activeTimer, elapsedTime, projects);
    summaryCache.weekKey = cacheKey;
    summaryCache.weekResult = result;

    return result;
};

/**
 * Clear summary cache when data changes significantly
 */
export const clearSummaryCache = () => {
    summaryCache = {};
};
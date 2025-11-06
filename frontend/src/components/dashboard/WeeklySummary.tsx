/**
 * Weekly Summary Component
 * ---------------------------------------------------------------------------
 * Displays weekly time tracking summary with total time and project breakdown.
 */

import React from 'react';
import { Card } from '@/components/ui';
import { useAppStore } from '@/store';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { getMemoizedWeeklySummary, formatDuration } from '@/utils/time';

const WeeklySummary: React.FC = () => {
    const { timeEntries, activeTimer, elapsedTime, projects } = useAppStore();

    // Enable real-time updates when timer is active
    useRealTimeUpdates();

    const summary = getMemoizedWeeklySummary(timeEntries, activeTimer, elapsedTime, projects);

    return (
        <Card className="h-full">
            <div className="flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
            </div>
            <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-green-700">Total Time</span>
                        <span className="text-xl font-bold text-green-900">
                            {formatDuration(summary.totalTime)}
                        </span>
                    </div>
                </div>
                <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Entries:</span>
                    <span className="font-semibold text-lg">
                        {summary.entriesCount}
                    </span>
                </div>

                {summary.projectGroups.length > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">By Project:</h4>
                        <div className="space-y-2">
                            {summary.projectGroups.slice(0, 5).map((group) => (
                                <div key={group.project?.id || 'no-project'} className="flex justify-between items-center py-1">
                                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                                        <div
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{
                                                backgroundColor: group.project?.color || '#6b7280'
                                            }}
                                        />
                                        <span className="text-sm text-gray-600 truncate">
                                            {group.project?.name || 'No Project'}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 ml-2">
                                        {formatDuration(group.totalDuration)}
                                    </span>
                                </div>
                            ))}
                            {summary.projectGroups.length > 5 && (
                                <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
                                    +{summary.projectGroups.length - 5} more projects
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default WeeklySummary;
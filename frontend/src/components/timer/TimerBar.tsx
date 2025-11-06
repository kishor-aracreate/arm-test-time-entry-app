/**
 * TimerBar Component
 * ---------------------------------------------------------------------------
 * Main timer interface with start/stop controls, elapsed time display,
 * and task/project selection form.
 */

import React, { useState, useEffect } from 'react';
import { useAppWithToast } from '@/hooks/useAppWithToast';
import { Button, Input, Card } from '@/components/ui';


const TimerBar: React.FC = () => {
    const {
        activeTimer,
        elapsedTime,
        projects,
        isLoading,
        error,
        startTimer,
        stopTimer,
        updateElapsedTime,
        fetchProjects,
        clearError
    } = useAppWithToast();

    const [taskName, setTaskName] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>();

    // Load projects on component mount
    useEffect(() => {
        fetchProjects();
    }, []); // Empty dependency array - only run on mount

    // Update elapsed time every second when timer is active
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (activeTimer) {
            interval = setInterval(() => {
                updateElapsedTime();
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [activeTimer, updateElapsedTime]);

    // Format elapsed time as HH:MM:SS
    const formatElapsedTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartTimer = async () => {
        if (!taskName.trim()) {
            return;
        }

        try {
            clearError();
            await startTimer({
                taskName: taskName.trim(),
                projectId: selectedProjectId
            });
        } catch (error) {
            console.error('Failed to start timer:', error);
        }
    };

    const handleStopTimer = async () => {
        try {
            clearError();
            await stopTimer();
            // Reset form after stopping
            setTaskName('');
            setSelectedProjectId(undefined);
        } catch (error) {
            console.error('Failed to stop timer:', error);
        }
    };

    const selectedProject = projects.find(p => p.id === selectedProjectId);

    return (
        <Card>
            <div className="space-y-6">
                {/* Timer Display */}
                <div className="text-center">
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-mono text-blue-600 mb-2 sm:mb-4">
                        {formatElapsedTime(elapsedTime)}
                    </div>
                    {activeTimer && (
                        <div className="text-sm sm:text-base text-gray-600 space-y-1">
                            <div className="font-medium text-gray-900 px-2">{activeTimer.taskName}</div>
                            {activeTimer.project && (
                                <div className="flex items-center justify-center mt-2">
                                    <div
                                        className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                                        style={{ backgroundColor: activeTimer.project.color }}
                                    />
                                    <span className="text-sm">{activeTimer.project.name}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Timer Form */}
                {!activeTimer && (
                    <div className="space-y-4 sm:space-y-6">
                        <Input
                            type="text"
                            placeholder="What are you working on?"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && taskName.trim()) {
                                    handleStartTimer();
                                }
                            }}
                            disabled={isLoading}
                            className="text-base sm:text-sm"
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project (optional)
                            </label>
                            <select
                                value={selectedProjectId || ''}
                                onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : undefined)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm transition-colors"
                                disabled={isLoading}
                            >
                                <option value="">No project</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                            {selectedProject && (
                                <div className="flex items-center mt-2 p-2 bg-gray-50 rounded-md">
                                    <div
                                        className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                                        style={{ backgroundColor: selectedProject.color }}
                                    />
                                    <span className="text-sm text-gray-700 font-medium">{selectedProject.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <div className="text-sm text-red-600">{error}</div>
                    </div>
                )}

                {/* Timer Controls */}
                <div className="flex justify-center pt-2">
                    {!activeTimer ? (
                        <Button
                            size="lg"
                            onClick={handleStartTimer}
                            disabled={!taskName.trim() || isLoading}
                            isLoading={isLoading}
                            className="w-full sm:w-auto min-w-32 shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Start Timer
                        </Button>
                    ) : (
                        <Button
                            variant="danger"
                            size="lg"
                            onClick={handleStopTimer}
                            disabled={isLoading}
                            isLoading={isLoading}
                            className="w-full sm:w-auto min-w-32 shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l6 6m0-6l-6 6" />
                            </svg>
                            Stop Timer
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default TimerBar;
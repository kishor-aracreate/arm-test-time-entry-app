/**
 * Time Entries Page
 * ---------------------------------------------------------------------------
 * Interface for viewing and managing time entries with filtering options.
 */

import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, Button } from '@/components/ui';
import { TimeEntryForm, TimeEntryList } from '@/components/time-entries';
import { useAppStore } from '@/store';
import type { TimeEntry } from '@/store/types';

const TimeEntries: React.FC = () => {
    const {
        timeEntries,
        projects,
        isLoading,
        error,
        fetchTimeEntries,
        fetchProjects,
        deleteTimeEntry,
        clearError
    } = useAppStore();

    const [showForm, setShowForm] = useState(false);
    const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
    const [dateFilter, setDateFilter] = useState('today');
    const [projectFilter, setProjectFilter] = useState('');

    // Load data on component mount
    useEffect(() => {
        fetchProjects();
        fetchTimeEntries();
    }, [fetchProjects, fetchTimeEntries]);

    // Apply filters when they change
    useEffect(() => {
        let dateParam: string | undefined;

        if (dateFilter === 'today') {
            dateParam = new Date().toISOString().split('T')[0];
        } else if (dateFilter === 'week') {
            // For now, just fetch all entries for the week filter
            // In a real implementation, you'd calculate the week range
            dateParam = undefined;
        } else if (dateFilter === 'month') {
            // For now, just fetch all entries for the month filter
            // In a real implementation, you'd calculate the month range
            dateParam = undefined;
        }

        fetchTimeEntries(dateParam);
    }, [dateFilter, fetchTimeEntries]);

    const handleAddEntry = () => {
        setEditingEntry(null);
        setShowForm(true);
    };

    const handleEditEntry = (entry: TimeEntry) => {
        setEditingEntry(entry);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingEntry(null);
        clearError();
    };

    const handleFormSuccess = () => {
        // Refresh the time entries list
        fetchTimeEntries();
    };

    const handleDeleteEntry = async (id: number) => {
        try {
            await deleteTimeEntry(id);
        } catch (error) {
            console.error('Failed to delete time entry:', error);
        }
    };

    const handleApplyFilters = () => {
        // Filters are applied automatically via useEffect
        // This function is here for potential future enhancements
    };

    // Filter entries by project if a project filter is selected
    const filteredEntries = projectFilter
        ? timeEntries.filter(entry => entry.projectId?.toString() === projectFilter)
        : timeEntries;

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Time Entries</h1>
                    <Button onClick={handleAddEntry}>Add Entry</Button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    onClick={clearError}
                                    className="text-red-400 hover:text-red-600"
                                >
                                    <span className="sr-only">Dismiss</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <Card>
                    <div className="flex flex-wrap gap-4 items-center">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date Range
                            </label>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="all">All Time</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project
                            </label>
                            <select
                                value={projectFilter}
                                onChange={(e) => setProjectFilter(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Projects</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <Button variant="secondary" size="sm" onClick={handleApplyFilters}>
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Time Entries List */}
                <TimeEntryList
                    entries={filteredEntries}
                    onEdit={handleEditEntry}
                    onDelete={handleDeleteEntry}
                    isLoading={isLoading}
                />

                {/* Time Entry Form Modal */}
                {showForm && (
                    <TimeEntryForm
                        timeEntry={editingEntry}
                        onClose={handleCloseForm}
                        onSuccess={handleFormSuccess}
                    />
                )}
            </div>
        </Layout>
    );
};

export default TimeEntries;
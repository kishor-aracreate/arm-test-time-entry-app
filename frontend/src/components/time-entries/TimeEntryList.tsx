/**
 * TimeEntryList Component
 * ---------------------------------------------------------------------------
 * Display and manage time entries with filtering and CRUD operations.
 */

import React, { useState } from "react";
import { Card, Button } from "@/components/ui";
import type { TimeEntry } from "@/store/types";

interface TimeEntryListProps {
  entries: TimeEntry[];
  onEdit: (entry: TimeEntry) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

const TimeEntryList: React.FC<TimeEntryListProps> = ({
  entries,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this time entry?")) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const groupEntriesByDate = (entries: TimeEntry[]) => {
    const groups: { [key: string]: TimeEntry[] } = {};

    entries.forEach((entry) => {
      const date = new Date(entry.startTime).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
    });

    // Sort groups by date (most recent first)
    const sortedGroups = Object.entries(groups).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    );

    return sortedGroups;
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg shadow-shadow" padding="none">
        <div className="text-center py-12 p-4 bg-bg text-text">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="">Loading time entries...</p>
        </div>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="shadow-lg shadow-shadow" padding="none">
        <div className="text-center justify-center py-12 text-text bg-bg p-4">
          <h3 className="text-lg font-medium  mb-2">No time entries found</h3>
          <p className="">
            Start tracking time or add manual entries to see them here.
          </p>
        </div>
      </Card>
    );
  }

  const groupedEntries = groupEntriesByDate(entries);

  return (
    <div className="space-y-6 bg-bg">
      {groupedEntries.map(([date, dateEntries]) => {
        const totalDuration = dateEntries.reduce(
          (sum, entry) => sum + entry.duration,
          0
        );

        return (
          <Card key={date} padding="none" className="shadow-lg shadow-shadow">
            <div className="bg-bg text-text p-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium ">
                    {formatDate(new Date(date))}
                  </h3>
                  <span className="text-sm font-medium ">
                    Total: {formatDuration(totalDuration)}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {dateEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start space-x-3">
                          {entry.project && (
                            <div
                              className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 mr-2"
                              style={{ backgroundColor: entry.project.color }}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm sm:text-base font-medium  break-words">
                              {entry.taskName}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm  mt-1 space-y-1 sm:space-y-0">
                              {entry.project && (
                                <span className="font-medium">
                                  {entry.project.name}
                                </span>
                              )}
                              <span>
                                {formatTime(entry.startTime)} -{" "}
                                {formatTime(entry.endTime)}
                              </span>
                              <span className="font-semibold ">
                                {formatDuration(entry.duration)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 sm:ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(entry)}
                          disabled={deletingId === entry.id}
                          className="flex-1 sm:flex-none"
                        >
                          <svg
                            className="w-4 h-4 sm:mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          disabled={deletingId === entry.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                        >
                          {deletingId === entry.id ? (
                            <svg
                              className="animate-spin h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4 sm:mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              <span className="hidden sm:inline">Delete</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default TimeEntryList;

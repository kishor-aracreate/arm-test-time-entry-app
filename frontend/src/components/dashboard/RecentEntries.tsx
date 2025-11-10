/**
 * Recent Entries Component
 * ---------------------------------------------------------------------------
 * Displays recent time entries with project information and quick actions.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui";
import { useAppStore } from "@/store";
import { formatDuration } from "@/utils/time";
import { Button } from "@kishor-aracreate/ac-ui-library-test";

const RecentEntries: React.FC = () => {
  const navigate = useNavigate();
  const { timeEntries, projects } = useAppStore();

  // Get the 5 most recent entries
  const recentEntries = timeEntries
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const entryDate = new Date(date);

    if (entryDate.toDateString() === today.toDateString()) {
      return "Today";
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (entryDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return entryDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (recentEntries.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Entries
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">
            No time entries yet. Start your first timer!
          </div>
          <Button variant="primary" type="submit">
            Start Timer
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="none" className="shadow-lg shadow-shadow">
      <div className="bg-bg text-text p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Entries</h3>
          <Button variant="primary" onClick={() => navigate("/time-entries")}>
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {recentEntries.map((entry) => {
            const project = entry.projectId
              ? projects.find((p) => p.id === entry.projectId)
              : null;

            return (
              <div
                key={entry.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {project && (
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                    )}
                    <span className="text-sm font-medium truncate">
                      {entry.taskName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs ">
                    <span>{formatDate(entry.startTime)}</span>
                    <span>•</span>
                    <span>
                      {formatTime(entry.startTime)} -{" "}
                      {formatTime(entry.endTime)}
                    </span>
                    {project && (
                      <>
                        <span>•</span>
                        <span>{project.name}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900 ml-4">
                  {formatDuration(entry.duration)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default RecentEntries;

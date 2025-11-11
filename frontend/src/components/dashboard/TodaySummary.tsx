/**
 * Today's Summary Component
 * ---------------------------------------------------------------------------
 * Displays today's time tracking summary with total time and project breakdown.
 */

import React from "react";
import { Card } from "@/components/ui";
import { useAppStore } from "@/store";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";
import { getMemoizedTodaySummary, formatDuration } from "@/utils/time";
import { IconClockShare } from "@tabler/icons-react";

const TodaySummary: React.FC = () => {
  const { timeEntries, activeTimer, elapsedTime, projects } = useAppStore();

  // Enable real-time updates when timer is active
  useRealTimeUpdates();

  const summary = getMemoizedTodaySummary(
    timeEntries,
    activeTimer,
    elapsedTime,
    projects
  );

  return (
    <Card className="shadow-lg shadow-shadow mt-2 mb-2" padding="none">
      <div className="bg-bg text-text p-2">
        <div className="flex items-center space-x-2 mb-4 bg-bg text-text">
          <IconClockShare className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Today's Summary</h3>
        </div>
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium ">Total Time</span>
              <span className="text-xl font-bold text-blue-900">
                {formatDuration(summary.totalTime)}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="">Entries:</span>
            <span className="font-semibold text-lg">
              {summary.entriesCount}
            </span>
          </div>

          {summary.projectGroups.length > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <h4 className="text-sm font-medium mb-3 mt-4">By Project:</h4>
              <div className="space-y-2">
                {summary.projectGroups.map((group) => (
                  <div
                    key={group.project?.id || "no-project"}
                    className="flex justify-between items-center py-1"
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: group.project?.color || "#6b7280",
                        }}
                      />
                      <span className="text-sm  truncate">
                        {group.project?.name || "No Project"}
                      </span>
                    </div>
                    <span className="text-sm font-medium  ml-2">
                      {formatDuration(group.totalDuration)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TodaySummary;

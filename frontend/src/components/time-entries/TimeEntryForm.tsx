/**
 * TimeEntryForm Component
 * ---------------------------------------------------------------------------
 * Form for creating and editing manual time entries with validation.
 */

import React, { useState, useEffect } from "react";
import { Card, Button, Input } from "@/components/ui";
import { useAppWithToast } from "@/hooks/useAppWithToast";
import type {
  TimeEntry,
  CreateTimeEntryData,
  UpdateTimeEntryData,
} from "@/store/types";

interface TimeEntryFormProps {
  timeEntry?: TimeEntry | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({
  timeEntry,
  onClose,
  onSuccess,
}) => {
  const { createTimeEntry, updateTimeEntry, projects, isLoading, error } =
    useAppWithToast();
  const [formData, setFormData] = useState({
    taskName: "",
    projectId: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });
  const [formErrors, setFormErrors] = useState<{
    taskName?: string;
    startTime?: string;
    endTime?: string;
    duration?: string;
  }>({});

  // Initialize form data when editing
  useEffect(() => {
    if (timeEntry) {
      const startDateTime = new Date(timeEntry.startTime);
      const endDateTime = new Date(timeEntry.endTime);

      setFormData({
        taskName: timeEntry.taskName,
        projectId: timeEntry.projectId?.toString() || "",
        startDate: formatDate(startDateTime),
        startTime: formatTime(startDateTime),
        endDate: formatDate(endDateTime),
        endTime: formatTime(endDateTime),
      });
    } else {
      // Default to current time for new entries
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      setFormData({
        taskName: "",
        projectId: "",
        startDate: formatDate(oneHourAgo),
        startTime: formatTime(oneHourAgo),
        endDate: formatDate(now),
        endTime: formatTime(now),
      });
    }
    setFormErrors({});
  }, [timeEntry]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const combineDateTime = (date: string, time: string): Date | null => {
    if (!date || !time) return null;
    return new Date(`${date}T${time}`);
  };

  const calculateDuration = (): number => {
    const start = combineDateTime(formData.startDate, formData.startTime);
    const end = combineDateTime(formData.endDate, formData.endTime);

    if (!start || !end) return 0;
    return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const validateForm = (): boolean => {
    const errors: typeof formErrors = {};

    // Task name validation
    if (!formData.taskName.trim()) {
      errors.taskName = "Task name is required";
    } else if (formData.taskName.trim().length < 2) {
      errors.taskName = "Task name must be at least 2 characters";
    } else if (formData.taskName.trim().length > 255) {
      errors.taskName = "Task name must be less than 255 characters";
    }

    // Start date/time validation
    if (!formData.startDate) {
      errors.startTime = "Start date is required";
    }
    if (!formData.startTime) {
      errors.startTime = "Start time is required";
    }

    // End date/time validation
    if (!formData.endDate) {
      errors.endTime = "End date is required";
    }
    if (!formData.endTime) {
      errors.endTime = "End time is required";
    }

    // Duration validation
    const start = combineDateTime(formData.startDate, formData.startTime);
    const end = combineDateTime(formData.endDate, formData.endTime);

    if (start && end) {
      if (end.getTime() <= start.getTime()) {
        errors.endTime = "End time must be after start time";
      }

      const duration = calculateDuration();
      if (duration > 24 * 60 * 60) {
        // More than 24 hours
        errors.duration = "Duration cannot exceed 24 hours";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const startDateTime = combineDateTime(formData.startDate, formData.startTime);
      const endDateTime = combineDateTime(formData.endDate, formData.endTime);

      if (!startDateTime || !endDateTime) {
        return;
      }

      const entryData = {
        taskName: formData.taskName.trim(),
        projectId: formData.projectId
          ? parseInt(formData.projectId)
          : undefined,
        startTime: startDateTime,
        endTime: endDateTime,
      };

      if (timeEntry) {
        await updateTimeEntry(timeEntry.id, entryData as UpdateTimeEntryData);
      } else {
        await createTimeEntry(entryData as CreateTimeEntryData);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to save time entry:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const duration = calculateDuration();

  return (
    <div className="fixed inset-0 bg-bg
     bg-opacity-500 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md" padding="none">
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-bg text-text">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold ">
              {timeEntry ? "Edit Time Entry" : "Add Time Entry"}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-10"
              disabled={isLoading}
            >
              ×
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <Input
              label="Task Name"
              name="taskName"
              value={formData.taskName}
              onChange={handleInputChange}
              error={formErrors.taskName}
              placeholder="What did you work on?"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium  mb-1">Project</label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleInputChange}
              disabled={isLoading}
              className="block w-full bg-bg text-text px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">No Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start</label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  error={formErrors.startTime}
                  disabled={isLoading}
                  required
                />
                <Input
                  label="Time"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End</label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  error={formErrors.endTime}
                  disabled={isLoading}
                  required
                />
                <Input
                  label="Time"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
          </div>

          {duration > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Duration:</span>{" "}
                {formatDuration(duration)}
              </p>
            </div>
          )}

          {formErrors.duration && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{formErrors.duration}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              {timeEntry ? "Update Entry" : "Add Entry"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TimeEntryForm;

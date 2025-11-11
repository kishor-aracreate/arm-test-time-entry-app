/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * useAppWithToast Hook
 * ---------------------------------------------------------------------------
 * Integrates core app store actions with toast notifications using React Toastify.
 */

import { useCallback } from "react";
import { useAppStore } from "@/store";
import toast from "@/components/ui/Toast";
import type {
  StartTimerData,
  CreateProjectData,
  CreateTimeEntryData,
  UpdateTimeEntryData,
} from "@/store/types";

export const useAppWithToast = () => {
  const store = useAppStore();

  // Timer actions
  // Updated error handling for all methods
  const startTimer = useCallback(
    async (timerData: StartTimerData) => {
      try {
        await store.startTimer(timerData);
        toast.success(`Started tracking "${timerData.taskName}"`, {
          autoClose: 3000,
        });
      } catch (error: any) {
        // Handle specific error cases
        if (error && error.code === 'TIMER_ALREADY_ACTIVE') {
          // Sync state with backend when there's an active timer conflict
          await store.fetchActiveTimer();
          toast.error("You already have an active timer running. Please stop it first.");
        } else {
          // Safe error message extraction
          let errorMessage = "Failed to start timer. Please try again.";
          if (error) {
            if (error.message) {
              errorMessage = error.message;
            } else if (typeof error === 'string') {
              errorMessage = error;
            } else if (typeof error.toString === 'function') {
              errorMessage = error.toString();
            }
          }
          toast.error(errorMessage);
        }
        throw error;
      }
    },
    [store]
  );

  const stopTimer = useCallback(async () => {
    try {
      const activeTimer = store.activeTimer;
      await store.stopTimer();

      if (activeTimer) {
        const duration = Math.floor(
          (Date.now() - new Date(activeTimer.startTime).getTime()) / 1000
        );
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

        toast.success(
          `Stopped timer: Tracked ${timeStr} for "${activeTimer.taskName}"`,
          {
            autoClose: 4000,
          }
        );
      }
    } catch (error: any) {
      // Safe error message extraction
      let errorMessage = "Failed to stop timer. Please try again.";
      if (error) {
        if (error.message) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else if (typeof error.toString === 'function') {
          errorMessage = error.toString();
        }
      }
      toast.error(errorMessage);
      throw error;
    }
  }, [store]);
  // Project actions
  const createProject = useCallback(
    async (project: CreateProjectData) => {
      try {
        await store.createProject(project);
        toast.success(`Project "${project.name}" created successfully.`, {
          autoClose: 3000,
        });
      } catch (error: any) {
        toast.error(
          (error && error.message) || "Failed to create project. Please try again."
        );
        throw error;
      }
    },
    [store] // Include store as dependency
  );

  const updateProject = useCallback(
    async (id: number, project: Partial<CreateProjectData>) => {
      try {
        await store.updateProject(id, project);
        toast.success(
          project.name
            ? `Project "${project.name}" updated successfully.`
            : "Project updated successfully.",
          { autoClose: 3000 }
        );
      } catch (error: any) {
        toast.error(
          (error && error.message) || "Failed to update project. Please try again."
        );
        throw error;
      }
    },
    [store] // Include store as dependency
  );

  const deleteProject = useCallback(
    async (id: number) => {
      try {
        const project = store.projects.find((p) => p.id === id);
        await store.deleteProject(id);
        toast.success(
          project
            ? `Project "${project.name}" deleted successfully.`
            : "Project deleted successfully.",
          { autoClose: 3000 }
        );
      } catch (error: any) {
        toast.error(
          (error && error.message) || "Failed to delete project. Please try again."
        );
        throw error;
      }
    },
    [store] // Include store as dependency
  );

  // Time entry actions
  const createTimeEntry = useCallback(
    async (entry: CreateTimeEntryData) => {
      try {
        await store.createTimeEntry(entry);
        toast.success(
          `Time entry for "${entry.taskName}" created successfully.`,
          {
            autoClose: 3000,
          }
        );
      } catch (error: any) {
        toast.error(
          (error && error.message) || "Failed to create time entry. Please try again."
        );
        throw error;
      }
    },
    [store] // Include store as dependency
  );

  const updateTimeEntry = useCallback(
    async (id: number, entry: UpdateTimeEntryData) => {
      try {
        await store.updateTimeEntry(id, entry);
        toast.success("Time entry updated successfully.", { autoClose: 3000 });
      } catch (error: any) {
        toast.error(
          (error && error.message) || "Failed to update time entry. Please try again."
        );
        throw error;
      }
    },
    [store] // Include store as dependency
  );

  const deleteTimeEntry = useCallback(
    async (id: number) => {
      try {
        await store.deleteTimeEntry(id);
        toast.success("Time entry deleted successfully.", { autoClose: 3000 });
      } catch (error: any) {
        toast.error(
          (error && error.message) || "Failed to delete time entry. Please try again."
        );
        throw error;
      }
    },
    [store] // Include store as dependency
  );

  // Return enhanced store with toast-integrated actions
  return {
    ...store,
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

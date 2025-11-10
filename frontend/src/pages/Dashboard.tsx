/**
 * Dashboard Page
 * ---------------------------------------------------------------------------
 * Main dashboard showing timer controls, today's summary, and recent entries.
 */

import React, { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { TimerBar } from "@/components/timer";
import { TodaySummary, RecentEntries } from "@/components/dashboard";
import { useAppStore } from "@/store";
import { Loading } from "@/components/ui";

const Dashboard: React.FC = () => {
  const { fetchTimeEntries, fetchProjects, isLoading, isInitialLoading } =
    useAppStore();

  // Enable periodic refresh of data every minute (disabled for now to prevent issues)
  // usePeriodicRefresh(60000);

  // Fetch data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchTimeEntries(), fetchProjects()]);
    };
    loadInitialData();
  }, []); // Empty dependency array - only run on mount

  if (isInitialLoading || isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <Loading
            size="lg"
            text="Loading your dashboard..."
            className="text-center"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className=" space-y-6 sm:space-y-8">
        {/* Timer Section */}
        <div className="w-full ">
          <TimerBar />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <TodaySummary />
        </div>

        {/* Recent Entries */}
        <div className="w-full">
          <RecentEntries />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

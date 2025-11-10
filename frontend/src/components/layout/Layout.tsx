/**
 * Layout Component
 * ---------------------------------------------------------------------------
 * Main layout wrapper for the application providing consistent structure
 * across all pages. Includes navigation and static user info display.
 * Enhanced with responsive design and mobile-first approach.
 */

import React from "react";
import { OfflineIndicator } from "@/components/ui";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg">
      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* Navigation Bar */}
      <Navbar />

      {/* Main content */}
      <main className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

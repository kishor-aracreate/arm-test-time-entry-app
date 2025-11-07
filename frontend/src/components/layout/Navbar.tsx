/**
 * Navbar Component
 * ---------------------------------------------------------------------------
 * Navigation bar with links to main application sections.
 * Responsive design with mobile menu support and dropdown menus.
 */

import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projects } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [entriesDropdownOpen, setEntriesDropdownOpen] = useState(false);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const entriesDropdownRef = useRef<HTMLDivElement>(null);
  const projectsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        entriesDropdownRef.current &&
        !entriesDropdownRef.current.contains(event.target as Node)
      ) {
        setEntriesDropdownOpen(false);
      }
      if (
        projectsDropdownRef.current &&
        !projectsDropdownRef.current.contains(event.target as Node)
      ) {
        setProjectsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleEntriesFilter = (filter: string) => {
    navigate(`/time-entries?filter=${filter}`);
    setEntriesDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleProjectFilter = (projectId: string) => {
    navigate(`/time-entries?project=${projectId}`);
    setProjectsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleCreateProject = () => {
    navigate("/projects?action=create");
    setProjectsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span className="hidden sm:block">Timer App</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="md:flex items-center space-x-1">
            {/* Dashboard Link */}
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("/dashboard")
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="">Dashboard</span>
            </Link>

            {/* Time Entries Dropdown */}
            <div className="relative" ref={entriesDropdownRef}>
              <button
                onClick={() => {
                  setEntriesDropdownOpen(!entriesDropdownOpen);
                  setProjectsDropdownOpen(false);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/time-entries")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Time Entries</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {entriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      navigate("/time-entries");
                      setEntriesDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    All Entries
                  </button>
                  <button
                    onClick={() => handleEntriesFilter("today")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => handleEntriesFilter("week")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => handleEntriesFilter("month")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    This Month
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={() => {
                      navigate("/time-entries?action=add");
                      setEntriesDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium"
                  >
                    + Add Entry
                  </button>
                </div>
              )}
            </div>

            {/* Projects Dropdown */}
            <div className="relative" ref={projectsDropdownRef}>
              <button
                onClick={() => {
                  setProjectsDropdownOpen(!projectsDropdownOpen);
                  setEntriesDropdownOpen(false);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/projects")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span>Projects</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {projectsDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 max-h-96 overflow-y-auto">
                  <button
                    onClick={() => {
                      navigate("/projects");
                      setProjectsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    All Projects
                  </button>
                  <button
                    onClick={handleCreateProject}
                    className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium"
                  >
                    + Create Project
                  </button>
                  {projects.length > 0 && (
                    <>
                      <div className="border-t border-gray-200 my-1"></div>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                        Filter by Project
                      </div>
                      {projects.map((project) => (
                        <button
                          key={project.id}
                          onClick={() =>
                            handleProjectFilter(project.id.toString())
                          }
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2"
                        >
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: project.color }}
                          />
                          <span className="truncate">{project.name}</span>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-sm font-semibold text-white">T</span>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-gray-900">Timer User</p>
              <p className="text-xs text-gray-500">user@timer.app</p>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {/* User info on mobile */}
            <div className="flex items-center space-x-3 px-3 py-3 mb-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-sm font-semibold text-white">T</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Timer User</p>
                <p className="text-xs text-gray-500">user@timer.app</p>
              </div>
            </div>

            {/* Dashboard */}
            <Link
              to="/dashboard"
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                isActive("/dashboard")
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Dashboard</span>
            </Link>

            {/* Time Entries Section */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Time Entries
              </div>
              <button
                onClick={() => {
                  navigate("/time-entries");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
              >
                All Entries
              </button>
              <button
                onClick={() => handleEntriesFilter("today")}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
              >
                Today
              </button>
              <button
                onClick={() => handleEntriesFilter("week")}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
              >
                This Week
              </button>
              <button
                onClick={() => handleEntriesFilter("month")}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
              >
                This Month
              </button>
              <button
                onClick={() => {
                  navigate("/time-entries?action=add");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium rounded-lg"
              >
                + Add Entry
              </button>
            </div>

            {/* Projects Section */}
            <div className="space-y-1 pt-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Projects
              </div>
              <button
                onClick={() => {
                  navigate("/projects");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
              >
                All Projects
              </button>
              <button
                onClick={handleCreateProject}
                className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium rounded-lg"
              >
                + Create Project
              </button>
              {projects.length > 0 && (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500">
                    Filter by Project
                  </div>
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectFilter(project.id.toString())}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg flex items-center space-x-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="truncate">{project.name}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

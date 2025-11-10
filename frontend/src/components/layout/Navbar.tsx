/**
 * Navbar Component
 * ---------------------------------------------------------------------------
 * Navigation bar with links to main application sections.
 * Responsive design with mobile menu support and dropdown menus.
 */

import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import {
  IconClockEdit,
  IconFolder,
  IconHomeFilled,
  IconHours24,
} from "@tabler/icons-react";
const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projects } = useAppStore();
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
  };

  const handleProjectFilter = (projectId: string) => {
    navigate(`/time-entries?project=${projectId}`);
    setProjectsDropdownOpen(false);
  };

  const handleCreateProject = () => {
    navigate("/projects?action=create");
    setProjectsDropdownOpen(false);
  };

  return (
    <nav className="bg-bg text-text shadow-lg shadow-shadow rounded-lg my-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/clock" className="flex items-center space-x-2">
            <IconHours24 className="w-5 h-5" />
            <span className=" sm:block">Timer App</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="md:flex items-center space-x-1">
            {/* Dashboard Link */}
            <Link
              to="/clock"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("/clock")
                  ? "text-primary shadow-md"
                  : "text-text hover:text-primary"
              }`}
            >
              <IconHomeFilled className="w-5 h-5" />
              <span className="">Dashboard</span>
            </Link>

            {/* Time Entries Dropdown */}
            <div className="relative" ref={entriesDropdownRef}>
              <button
                onClick={() => {
                  setEntriesDropdownOpen(!entriesDropdownOpen);
                  setProjectsDropdownOpen(false);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:cursor-pointer ${
                  isActive("/time-entries")
                    ? " text-primary shadow-md"
                    : "text-text hover:text-primary"
                }`}
              >
                <IconClockEdit className="w-5 h-5" />
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
                <div className="absolute top-full left-0 mt-1 w-48 bg-bg text-text rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      navigate("/clock/time-entries");
                      setEntriesDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm  hover:bg-blue-50 hover:text-blue-600"
                  >
                    All Entries
                  </button>
                  <button
                    onClick={() => handleEntriesFilter("today")}
                    className="w-full text-left px-4 py-2 text-sm  hover:bg-blue-50 hover:text-blue-600"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => handleEntriesFilter("week")}
                    className="w-full text-left px-4 py-2 text-sm  hover:bg-blue-50 hover:text-blue-600"
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => handleEntriesFilter("month")}
                    className="w-full text-left px-4 py-2 text-sm  hover:bg-blue-50 hover:text-blue-600"
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
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:cursor-pointer ${
                  isActive("/clock/projects")
                    ? "text-primary shadow-md"
                    : "text-text hover:text-primary"
                }`}
              >
                <IconFolder className="w-5 h-5" />
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
                <div className="absolute top-full left-0 mt-1 w-56 bg-bg text-text rounded-lg shadow-lg border border-gray-200 py-1 z-50 max-h-96 overflow-y-auto">
                  <button
                    onClick={() => {
                      navigate("/clock/projects");
                      setProjectsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm  hover:bg-blue-50 hover:text-blue-600"
                  >
                    All Projects
                  </button>
                  <button
                    onClick={handleCreateProject}
                    className="w-full text-left px-4 py-2 text-sm  hover:bg-blue-50 font-medium"
                  >
                    + Create Project
                  </button>
                  {projects.length > 0 && (
                    <>
                      <div className="border-t border-gray-200 my-1"></div>
                      <div className="px-3 py-2 text-xs font-semibold  uppercase">
                        Filter by Project
                      </div>
                      {projects.map((project) => (
                        <button
                          key={project.id}
                          onClick={() =>
                            handleProjectFilter(project.id.toString())
                          }
                          className="w-full text-left px-4 py-2 text-sm  hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2"
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
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-gray-900">Timer User</p>
              <p className="text-xs text-gray-500">user@timer.app</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

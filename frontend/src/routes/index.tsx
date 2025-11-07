import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Projects, TimeEntries } from "@/pages";
import Debug from "@/pages/Debug";

/**
 * Router Component
 * ---------------------------------------------------------------------------
 * Application-level router configuration using `react-router-dom`.
 *
 * ✅ Responsibilities:
 * - Provide client-side routing context for the application.
 * - Define available routes and their corresponding page components.
 * - Serve as a central place to extend routing (add new pages, nested routes, etc.).
 *
 * @remarks
 * - Uses `HashRouter` for hash-based URLs (e.g., /#/path).
 * - Wrap all route definitions inside `<Routes>` for v6+ syntax.
 * - Each `<Route>` maps a `path` to a component.
 * - All routes are now directly accessible without authentication.
 *
 * @example
 * ```tsx
 * // App.tsx
 * import Router from '@/routes';
 *
 * function App() {
 *   return <Router />;
 * }
 * ```
 */
const Router: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Default route - redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Application routes - directly accessible */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/time-entries" element={<TimeEntries />} />
        <Route path="/debug" element={<Debug />} />

        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default Router;

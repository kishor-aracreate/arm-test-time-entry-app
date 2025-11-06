import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login, Signup, Dashboard, Projects, TimeEntries } from "@/pages";
import { ProtectedRoute } from "@/components/auth";

/**
 * Router Component
 * ---------------------------------------------------------------------------
 * Application-level router configuration using `react-router-dom`.
 *
 * ✅ Responsibilities:
 * - Provide client-side routing context for the application.
 * - Define available routes and their corresponding page components.
 * - Protect authenticated routes with ProtectedRoute wrapper.
 * - Serve as a central place to extend routing (add new pages, nested routes, etc.).
 *
 * @remarks
 * - Uses `HashRouter` for hash-based URLs (e.g., /#/path).
 * - Wrap all route definitions inside `<Routes>` for v6+ syntax.
 * - Each `<Route>` maps a `path` to a component.
 * - Protected routes require authentication to access.
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
        {/* Authentication routes - accessible without login */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes - require authentication */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/time-entries"
          element={
            <ProtectedRoute>
              <TimeEntries />
            </ProtectedRoute>
          }
        />

        {/* Catch all route - redirect to dashboard */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
};

export default Router;

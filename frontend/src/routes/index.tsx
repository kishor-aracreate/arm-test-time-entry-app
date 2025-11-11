import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Projects, TimeEntries, Login } from "@/pages";
import Debug from "@/pages/Debug";
import { getAccessToken } from "@/utils/token";

/**
 * Protected Route Component
 * Redirects to login if no access token exists
 */
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * Router Component
 * ---------------------------------------------------------------------------
 * Application-level router configuration using `react-router-dom`.
 *
 * ✅ Responsibilities:
 * - Provide client-side routing context for the application.
 * - Define available routes and their corresponding page components.
 * - Serve as a central place to extend routing (add new pages, nested routes, etc.).
 * - Protect routes that require authentication.
 *
 * @remarks
 * - Uses `HashRouter` for hash-based URLs (e.g., /#/path).
 * - Wrap all route definitions inside `<Routes>` for v6+ syntax.
 * - Each `<Route>` maps a `path` to a component.
 * - Protected routes check for access token and redirect to login if missing.
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
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Default route - redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected application routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/time-entries" element={<ProtectedRoute><TimeEntries /></ProtectedRoute>} />
        <Route path="/debug" element={<ProtectedRoute><Debug /></ProtectedRoute>} />

        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default Router;

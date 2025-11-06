import { HashRouter, Routes, Route } from "react-router-dom";
import HelloWorld from "@/pages/hello-world";

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
        {/* Root path → HelloWorld page */}
        <Route path="/" element={<HelloWorld />} />
      </Routes>
    </HashRouter>
  );
};

export default Router;

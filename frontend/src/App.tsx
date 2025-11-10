import Router from "@/routes";
import { ErrorBoundary } from "@/components/ui";
import { ToastContainer } from "react-toastify";

/**
 * App Component
 * ---------------------------------------------------------------------------
 * Root component of the application with comprehensive error handling and notifications.
 * Configured to work without authentication - direct access to all features.
 *
 * ✅ Responsibilities:
 * - Provide the application shell with error boundaries
 * - Provide global toast notification system
 * - Mount the routing system (`<Router />`) which defines all page-level routes
 * - Act as the single entry point rendered by `main.tsx`
 * - Ensure application works without authentication setup
 *
 * @remarks
 * - Keep this component lightweight; it should only wrap high-level providers
 *   (e.g., ErrorBoundary, ToastProvider) and the Router.
 * - All actual page rendering is delegated to `Router`.
 * - Error boundaries catch JavaScript errors anywhere in the component tree
 * - Toast provider enables global notification system
 * - No authentication providers needed - app uses static user ID
 *
 * @example
 * ```tsx
 * // main.tsx
 * import { StrictMode } from 'react';
 * import { createRoot } from 'react-dom/client';
 * import App from '@/App';
 *
 * createRoot(document.getElementById('root')!).render(
 *   <StrictMode>
 *     <App />
 *   </StrictMode>
 * );
 * ```
 */
function App() {
  return (
    <ErrorBoundary>
      <Router />
      <ToastContainer position="bottom-right" autoClose={2000} />
    </ErrorBoundary>
  );
}

export default App;

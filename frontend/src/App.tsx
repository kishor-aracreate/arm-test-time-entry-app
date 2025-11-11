import { useEffect } from "react";
import Router from "@/routes";
import { ErrorBoundary } from "@/components/ui";
import { useAppStore } from "@/store";
import { getAccessToken } from "@/utils/token";

/**
 * App Component
 * ---------------------------------------------------------------------------
 * Root component of the application with comprehensive error handling and notifications.
 *
 * ✅ Responsibilities:
 * - Provide the application shell with error boundaries
 * - Provide global toast notification system
 * - Mount the routing system (`<Router />`) which defines all page-level routes
 * - Act as the single entry point rendered by `main.tsx`
 * - Initialize app state (fetch active timer on mount if authenticated)
 *
 * @remarks
 * - Keep this component lightweight; it should only wrap high-level providers
 *   (e.g., ErrorBoundary, ToastProvider) and the Router.
 * - All actual page rendering is delegated to `Router`.
 * - Error boundaries catch JavaScript errors anywhere in the component tree
 * - Toast provider enables global notification system
 * - Authentication is handled by protected routes
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
  const fetchActiveTimer = useAppStore((state) => state.fetchActiveTimer);

  // Fetch active timer on app mount to sync state with backend
  // Only if user is authenticated (has token)
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      fetchActiveTimer();
    }
  }, [fetchActiveTimer]);

  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
}

export default App;

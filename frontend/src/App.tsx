import Router from '@/routes';
import { AuthProvider } from '@/components/auth';
import { ErrorBoundary } from '@/components/ui';
import { ToastProvider } from '@/components/providers/ToastProvider';

/**
 * App Component
 * ---------------------------------------------------------------------------
 * Root component of the application with comprehensive error handling and notifications.
 *
 * ✅ Responsibilities:
 * - Provide the application shell with error boundaries
 * - Wrap the app with authentication provider for JWT token management
 * - Provide global toast notification system
 * - Mount the routing system (`<Router />`) which defines all page-level routes
 * - Act as the single entry point rendered by `main.tsx`
 *
 * @remarks
 * - Keep this component lightweight; it should only wrap high-level providers
 *   (e.g., ErrorBoundary, ToastProvider, AuthProvider) and the Router.
 * - All actual page rendering is delegated to `Router`.
 * - Error boundaries catch JavaScript errors anywhere in the component tree
 * - Toast provider enables global notification system
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
      <ToastProvider>
        <AuthProvider>
          {/* Application Router handles all page navigation */}
          <Router />
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;

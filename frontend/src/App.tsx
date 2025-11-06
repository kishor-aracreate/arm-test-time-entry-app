import Router from '@/routes';

/**
 * App Component
 * ---------------------------------------------------------------------------
 * Root component of the application.
 *
 * ✅ Responsibilities:
 * - Provide the application shell.
 * - Mount the routing system (`<Router />`) which defines all page-level routes.
 * - Act as the single entry point rendered by `main.tsx`.
 *
 * @remarks
 * - Keep this component lightweight; it should only wrap high-level providers
 *   (e.g., ThemeProvider, QueryClientProvider, AuthProvider) and the Router.
 * - All actual page rendering is delegated to `Router`.
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
    <>
      {/* Application Router handles all page navigation */}
      <Router />
    </>
  );
}

export default App;

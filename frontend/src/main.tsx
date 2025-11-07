import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import App from '@/App.tsx';
import 'virtual:uno.css';
import '@kishor-aracreate/ac-ui-library-test/style.css';

/**
 * Application Entry Point
 * ---------------------------------------------------------------------------
 * This is the root of the application where the React app is bootstrapped
 * into the DOM.
 *
 * ✅ Responsibilities:
 * - Attach the React component tree (`<App />`) to the `#root` DOM node.
 * - Enable `React.StrictMode` for highlighting potential issues in dev mode.
 * - Load global styles (Tailwind / UnoCSS / app-wide CSS).
 *
 * @remarks
 * - `StrictMode` only runs in development; it helps catch unsafe lifecycles,
 *   deprecated APIs, and side-effect bugs.
 * - `virtual:uno.css` is injected by UnoCSS at build time.
 * - Keep this file minimal — only imports, providers, and the root render.
 *
 * @example
 * ```html
 * <!-- index.html -->
 * <body>
 *   <div id="root"></div>
 * </body>
 * ```
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

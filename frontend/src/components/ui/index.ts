/**
 * UI Components Index
 * ---------------------------------------------------------------------------
 * Barrel export for all UI components using AC UI library wrappers.
 */

// Export AC UI library wrappers for main components
export { default as Button } from './wrappers/ACButton';
export { default as Input } from './wrappers/ACInput';
export { default as Card } from './wrappers/ACCard';
export { default as Loading } from './wrappers/ACLoading';
export { default as Toast } from './wrappers/ACToast';

// Export components that don't have AC UI equivalents (keep original)
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as ToastContainer } from './ToastContainer';
export { default as OfflineIndicator } from './OfflineIndicator';

// Re-export types from wrappers
export type { ToastData, ToastType } from './wrappers/ACToast';
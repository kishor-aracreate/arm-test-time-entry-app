/**
 * ToastContainer Component
 * ---------------------------------------------------------------------------
 * Container for managing and displaying toast notifications.
 * Handles positioning, stacking, and lifecycle of toast messages.
 */

import React from 'react';
import Toast from './Toast';
import type { ToastData } from './Toast';

interface ToastContainerProps {
    toasts: ToastData[];
    onDismiss: (id: string) => void;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const ToastContainer: React.FC<ToastContainerProps> = ({
    toasts,
    onDismiss,
    position = 'top-right'
}) => {
    const getPositionClasses = () => {
        switch (position) {
            case 'top-right':
                return 'top-4 right-4';
            case 'top-left':
                return 'top-4 left-4';
            case 'bottom-right':
                return 'bottom-4 right-4';
            case 'bottom-left':
                return 'bottom-4 left-4';
            case 'top-center':
                return 'top-4 left-1/2 transform -translate-x-1/2';
            case 'bottom-center':
                return 'bottom-4 left-1/2 transform -translate-x-1/2';
            default:
                return 'top-4 right-4';
        }
    };

    if (toasts.length === 0) {
        return null;
    }

    return (
        <div className={`fixed z-50 ${getPositionClasses()}`}>
            <div className="space-y-3 w-80 max-w-sm">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        toast={toast}
                        onDismiss={onDismiss}
                    />
                ))}
            </div>
        </div>
    );
};

export default ToastContainer;
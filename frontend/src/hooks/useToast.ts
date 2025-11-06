/**
 * useToast Hook
 * ---------------------------------------------------------------------------
 * Custom hook for managing toast notifications throughout the application.
 * Provides methods to show different types of toasts and manage their lifecycle.
 */

import { useState, useCallback } from 'react';
import type { ToastData, ToastType } from '@/components/ui/Toast';

interface ShowToastOptions {
    title: string;
    message?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const useToast = () => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const generateId = () => {
        return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const showToast = useCallback((type: ToastType, options: ShowToastOptions) => {
        const id = generateId();
        const toast: ToastData = {
            id,
            type,
            title: options.title,
            message: options.message,
            duration: options.duration ?? (type === 'error' ? 0 : 5000), // Errors don't auto-dismiss
            action: options.action,
        };

        setToasts(prev => [...prev, toast]);
        return id;
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const dismissAll = useCallback(() => {
        setToasts([]);
    }, []);

    // Convenience methods for different toast types
    const success = useCallback((options: ShowToastOptions) => {
        return showToast('success', options);
    }, [showToast]);

    const error = useCallback((options: ShowToastOptions) => {
        return showToast('error', options);
    }, [showToast]);

    const warning = useCallback((options: ShowToastOptions) => {
        return showToast('warning', options);
    }, [showToast]);

    const info = useCallback((options: ShowToastOptions) => {
        return showToast('info', options);
    }, [showToast]);

    return {
        toasts,
        showToast,
        dismissToast,
        dismissAll,
        success,
        error,
        warning,
        info,
    };
};
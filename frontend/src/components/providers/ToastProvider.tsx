/**
 * ToastProvider Component
 * ---------------------------------------------------------------------------
 * Global toast provider that manages toast notifications across the entire application.
 * Provides toast context and renders the toast container.
 */

import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui';

interface ShowToastOptions {
    title: string;
    message?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface ToastContextType {
    success: (options: ShowToastOptions) => string;
    error: (options: ShowToastOptions) => string;
    warning: (options: ShowToastOptions) => string;
    info: (options: ShowToastOptions) => string;
    dismissToast: (id: string) => void;
    dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const {
        toasts,
        success,
        error,
        warning,
        info,
        dismissToast,
        dismissAll,
    } = useToast();

    const contextValue: ToastContextType = {
        success,
        error,
        warning,
        info,
        dismissToast,
        dismissAll,
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <ToastContainer
                toasts={toasts}
                onDismiss={dismissToast}
                position="top-right"
            />
        </ToastContext.Provider>
    );
};

export const useToastContext = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToastContext must be used within a ToastProvider');
    }
    return context;
};
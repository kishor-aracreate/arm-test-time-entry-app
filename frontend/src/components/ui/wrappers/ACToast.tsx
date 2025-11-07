/**
 * AC UI Toast Wrapper
 * ---------------------------------------------------------------------------
 * Wrapper component that maps existing Toast props to AC UI library Toast
 */

import React, { useEffect, useState } from 'react';
import { Toast as ACToast } from '@kishor-aracreate/ac-ui-library-test';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface ToastProps {
    toast: ToastData;
    onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (toast.duration && toast.duration > 0) {
            const timer = setTimeout(() => {
                handleDismiss();
            }, toast.duration);
            return () => clearTimeout(timer);
        }
    }, [toast.duration]);

    const handleDismiss = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onDismiss(toast.id);
        }, 300); // Match the animation duration
    };

    // Map our toast types to AC UI toast types
    const mapType = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'success';
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            case 'info':
                return 'info';
            default:
                return 'info';
        }
    };

    const visibilityStyles = isVisible && !isLeaving
        ? 'translate-x-0 opacity-100'
        : 'translate-x-full opacity-0';

    return (
        <div className={`transition-all duration-300 transform ${visibilityStyles}`}>
            <ACToast
                type={mapType(toast.type)}
                title={toast.title}
                description={toast.message}
                closable={true}
                onClose={handleDismiss}
                duration={0} // We handle duration ourselves for consistency
                animation="slide"
                position="top-right"
            />
            {toast.action && (
                <div className="mt-2 px-4">
                    <button
                        onClick={toast.action.onClick}
                        className="text-sm font-medium underline hover:no-underline"
                    >
                        {toast.action.label}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Toast;
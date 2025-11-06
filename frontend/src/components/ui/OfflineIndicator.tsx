/**
 * OfflineIndicator Component
 * ---------------------------------------------------------------------------
 * Shows a banner when the user is offline to inform them about connectivity issues.
 */

import React, { useEffect, useState } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

const OfflineIndicator: React.FC = () => {
    const isOnline = useOnlineStatus();
    const [showOfflineBanner, setShowOfflineBanner] = useState(false);
    const [hasBeenOffline, setHasBeenOffline] = useState(false);

    useEffect(() => {
        if (!isOnline) {
            setHasBeenOffline(true);
            setShowOfflineBanner(true);
        } else if (hasBeenOffline) {
            // Show reconnected message briefly
            setShowOfflineBanner(true);
            const timer = setTimeout(() => {
                setShowOfflineBanner(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOnline, hasBeenOffline]);

    if (!showOfflineBanner) {
        return null;
    }

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isOnline ? 'bg-green-600' : 'bg-red-600'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2 text-white">
                        {isOnline ? (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm font-medium">Back online! Your data will sync automatically.</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-medium">You're offline. Some features may not work properly.</span>
                            </>
                        )}
                    </div>
                    {isOnline && (
                        <button
                            onClick={() => setShowOfflineBanner(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OfflineIndicator;
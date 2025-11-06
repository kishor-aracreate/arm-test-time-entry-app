/**
 * Quick Actions Component
 * ---------------------------------------------------------------------------
 * Provides quick access to common actions from the dashboard.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/components/ui';

const QuickActions: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Card className="h-full">
            <div className="flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="space-y-3">
                <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    onClick={() => navigate('/time-entries')}
                >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    View All Entries
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-green-50 hover:text-green-700 transition-colors"
                    onClick={() => navigate('/projects')}
                >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Manage Projects
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    onClick={() => navigate('/time-entries?action=add')}
                >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Manual Entry
                </Button>
            </div>
        </Card>
    );
};

export default QuickActions;